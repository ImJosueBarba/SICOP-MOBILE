import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, BehaviorSubject, interval, switchMap, timer } from 'rxjs';
import { ReportesService } from './reportes.service';
import {
  KPIDashboard,
  KPIValue,
  KPIStatus,
  TrendDirection,
  TimeFilter,
  TrendData,
  OperationalStats,
  THRESHOLD_CONFIGS
} from '../models/dashboard.model';
import { ControlOperacion } from '../models/reportes.model';

/**
 * Dashboard KPI Service - BI Industrial
 * Servicio para cargar y procesar KPIs operacionales en tiempo real
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardKPIService {
  private currentFilter$ = new BehaviorSubject<TimeFilter | null>(null);
  
  constructor(private reportesService: ReportesService) {}

  /**
   * Carga KPIs del dashboard con filtro de tiempo
   */
  loadKPIDashboard(filter: TimeFilter): Observable<KPIDashboard> {
    const fechaInicio = this.formatDate(filter.start);
    const fechaFin = this.formatDate(filter.end);

    return this.reportesService.getControlOperacion(fechaInicio, fechaFin).pipe(
      map(data => this.transformToKPIDashboard(data, filter)),
      catchError(error => {
        console.error('Error loading KPI dashboard:', error);
        return of(this.getEmptyDashboard());
      })
    );
  }

  /**
   * Suscripción a actualizaciones automáticas de KPIs
   * Se ejecuta inmediatamente y luego cada refreshInterval milisegundos
   */
  subscribeToRealTimeKPIs(filter: TimeFilter): Observable<KPIDashboard> {
    if (!filter.refreshInterval || filter.refreshInterval === 0) {
      return this.loadKPIDashboard(filter);
    }

    // timer(0, interval) ejecuta inmediatamente y luego cada 'interval' ms
    return timer(0, filter.refreshInterval).pipe(
      switchMap(() => this.loadKPIDashboard(filter))
    );
  }

  /**
   * Obtiene datos de tendencia para gráficas
   */
  getTrendData(parameter: keyof KPIDashboard, filter: TimeFilter): Observable<TrendData> {
    const fechaInicio = this.formatDate(filter.start);
    const fechaFin = this.formatDate(filter.end);

    return this.reportesService.getControlOperacion(fechaInicio, fechaFin).pipe(
      map(data => this.extractTrendData(data, parameter)),
      catchError(() => of({ parameter: parameter as string, unit: '', data: [] }))
    );
  }

  /**
   * Obtiene estadísticas operacionales resumidas
   */
  getOperationalStats(filter: TimeFilter): Observable<OperationalStats> {
    return this.loadKPIDashboard(filter).pipe(
      map(dashboard => this.calculateStats(dashboard))
    );
  }

  /**
   * Transforma datos de control de operación a KPI Dashboard
   */
  private transformToKPIDashboard(data: ControlOperacion[], filter: TimeFilter): KPIDashboard {
    if (data.length === 0) {
      return this.getEmptyDashboard();
    }

    // Ordenar por fecha/hora para obtener valores actuales y previos
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(`${a.fecha} ${a.hora}`);
      const dateB = new Date(`${b.fecha} ${b.hora}`);
      return dateB.getTime() - dateA.getTime();
    });

    const latest = sortedData[0];
    const previous = sortedData.length > 1 ? sortedData[1] : null;

    return {
      turbidityRaw: this.createKPIValue(
        'turbidityRaw',
        'Turbedad AC',
        latest.turbedad_ac || 0,
        previous?.turbedad_ac,
        'FTU'
      ),
      turbidityTreated: this.createKPIValue(
        'turbidityTreated',
        'Turbedad AT',
        latest.turbedad_at || 0,
        previous?.turbedad_at,
        'FTU'
      ),
      phRaw: this.createKPIValue(
        'phRaw',
        'pH AC',
        latest.ph_ac || 0,
        previous?.ph_ac,
        ''
      ),
      phTreated: this.createKPIValue(
        'phTreated',
        'pH AT',
        latest.ph_at || 0,
        previous?.ph_at,
        ''
      ),
      chlorineResidual: this.createKPIValue(
        'chlorineResidual',
        'Cloro Residual',
        latest.cloro_residual || 0,
        previous?.cloro_residual,
        'mg/L'
      ),
      pressure: this.createKPIValue(
        'pressure',
        'Presión',
        latest.presion_psi || 0,
        previous?.presion_psi,
        'PSI'
      ),
      flow: this.createKPIValue(
        'flow',
        'Caudal',
        this.calculateAverageFlow(data),
        this.calculateAverageFlow(sortedData.slice(1)),
        'm³/h'
      ),
      temperature: this.createKPIValue(
        'temperature',
        'Temperatura',
        this.calculateAverageTemperature(data),
        this.calculateAverageTemperature(sortedData.slice(1)),
        '°C'
      ),
      lastUpdate: new Date(),
      dataPoints: data.length,
      timeRange: {
        start: filter.start,
        end: filter.end
      }
    };
  }

  /**
   * Crea un valor de KPI con estado y tendencia
   */
  private createKPIValue(
    parameter: string,
    label: string,
    current: number,
    previous: number | undefined,
    unit: string
  ): KPIValue {
    const config = THRESHOLD_CONFIGS.find(c => c.parameter === parameter);
    
    if (!config) {
      return {
        current,
        previous,
        status: 'unknown',
        threshold: { min: 0, max: 100 },
        trend: 'stable',
        unit,
        label
      };
    }

    const status = this.evaluateStatus(current, config);
    const trend = this.calculateTrend(current, previous);

    return {
      current,
      previous,
      status,
      threshold: {
        min: config.normal.min,
        max: config.normal.max,
        warningMin: config.warning.min,
        warningMax: config.warning.max
      },
      trend,
      unit,
      label
    };
  }

  /**
   * Evalúa el estado de un valor según los umbrales configurados
   */
  private evaluateStatus(value: number, config: any): KPIStatus {
    if (value < config.critical.min || value > config.critical.max) {
      return 'critical';
    }
    if (value < config.warning.min || value > config.warning.max) {
      return 'warning';
    }
    if (value >= config.normal.min && value <= config.normal.max) {
      return 'normal';
    }
    return 'unknown';
  }

  /**
   * Calcula la tendencia comparando valor actual con anterior
   */
  private calculateTrend(current: number, previous?: number): TrendDirection {
    if (!previous || current === previous) return 'stable';
    const diff = Math.abs(current - previous);
    const threshold = previous * 0.05; // 5% threshold
    
    if (diff < threshold) return 'stable';
    return current > previous ? 'up' : 'down';
  }

  /**
   * Calcula caudal promedio (nota: en el modelo no hay campo directo, usar presion_total como proxy)
   */
  private calculateAverageFlow(data: ControlOperacion[]): number {
    if (data.length === 0) return 0;
    
    // Como no hay campo de caudal directo, usar presion_total como aproximación
    const validValues = data
      .map(d => d.presion_total || 0)
      .filter(v => v > 0);
    
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / validValues.length) * 10) / 10;
  }

  /**
   * Calcula temperatura promedio (nota: en el modelo no hay campo directo)
   */
  private calculateAverageTemperature(data: ControlOperacion[]): number {
    // Como el modelo ControlOperacion no tiene temperatura, retornar 25°C como valor por defecto
    // En producción, esto vendría de MonitoreoFisicoquimico
    return 25.0;
  }

  /**
   * Extrae datos de tendencia para un parámetro específico
   */
  private extractTrendData(data: ControlOperacion[], parameter: string): TrendData {
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(`${a.fecha} ${a.hora}`);
      const dateB = new Date(`${b.fecha} ${b.hora}`);
      return dateA.getTime() - dateB.getTime();
    });

    let parameterKey: keyof ControlOperacion;
    let unit = '';

    switch (parameter) {
      case 'turbidityRaw':
        parameterKey = 'turbedad_ac';
        unit = 'FTU';
        break;
      case 'turbidityTreated':
        parameterKey = 'turbedad_at';
        unit = 'FTU';
        break;
      case 'phRaw':
        parameterKey = 'ph_ac';
        unit = '';
        break;
      case 'phTreated':
        parameterKey = 'ph_at';
        unit = '';
        break;
      case 'chlorineResidual':
        parameterKey = 'cloro_residual';
        unit = 'mg/L';
        break;
      case 'pressure':
        parameterKey = 'presion_psi';
        unit = 'PSI';
        break;
      default:
        parameterKey = 'turbedad_ac';
        unit = 'unknown';
    }

    const trendPoints = sortedData.map(d => ({
      timestamp: new Date(`${d.fecha} ${d.hora}`),
      value: (d[parameterKey] as number) || 0
    }));

    return {
      parameter,
      unit,
      data: trendPoints
    };
  }

  /**
   * Calcula estadísticas operacionales del dashboard
   */
  private calculateStats(dashboard: KPIDashboard): OperationalStats {
    const kpis = [
      dashboard.turbidityRaw,
      dashboard.turbidityTreated,
      dashboard.phRaw,
      dashboard.phTreated,
      dashboard.chlorineResidual,
      dashboard.pressure,
      dashboard.flow,
      dashboard.temperature
    ];

    return {
      totalRecords: dashboard.dataPoints,
      activeAlerts: kpis.filter(k => k.status === 'critical').length,
      normalParameters: kpis.filter(k => k.status === 'normal').length,
      warningParameters: kpis.filter(k => k.status === 'warning').length,
      criticalParameters: kpis.filter(k => k.status === 'critical').length
    };
  }

  /**
   * Retorna dashboard vacío como fallback
   */
  private getEmptyDashboard(): KPIDashboard {
    const emptyKPI = (label: string, unit: string): KPIValue => ({
      current: 0,
      status: 'unknown',
      threshold: { min: 0, max: 100 },
      trend: 'stable',
      unit,
      label
    });

    return {
      turbidityRaw: emptyKPI('Turbedad AC', 'FTU'),
      turbidityTreated: emptyKPI('Turbedad AT', 'FTU'),
      phRaw: emptyKPI('pH AC', ''),
      phTreated: emptyKPI('pH AT', ''),
      chlorineResidual: emptyKPI('Cloro Residual', 'mg/L'),
      pressure: emptyKPI('Presión', 'PSI'),
      flow: emptyKPI('Caudal', 'm³/h'),
      temperature: emptyKPI('Temperatura', '°C'),
      lastUpdate: new Date(),
      dataPoints: 0,
      timeRange: {
        start: new Date(),
        end: new Date()
      }
    };
  }

  /**
   * Formatea fecha a string YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
