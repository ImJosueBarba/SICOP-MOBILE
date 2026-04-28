import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  KPIDashboard,
  KPIValue,
  ThresholdAlert,
  THRESHOLD_CONFIGS
} from '../models/dashboard.model';

/**
 * Threshold Service - Sistema de Alertas Industriales
 * Servicio para detectar y gestionar alertas de umbrales excedidos
 */
@Injectable({
  providedIn: 'root'
})
export class ThresholdService {
  private alerts$ = new BehaviorSubject<ThresholdAlert[]>([]);
  private alertHistory: ThresholdAlert[] = [];
  private maxHistorySize = 100;

  constructor() {}

  /**
   * Observable de alertas activas
   */
  getAlerts(): Observable<ThresholdAlert[]> {
    return this.alerts$.asObservable();
  }

  /**
   * Evalúa dashboard completo y genera alertas
   */
  evaluateDashboard(dashboard: KPIDashboard): ThresholdAlert[] {
    const newAlerts: ThresholdAlert[] = [];

    // Evaluar cada KPI
    const kpiEntries: [string, KPIValue][] = [
      ['turbidityRaw', dashboard.turbidityRaw],
      ['turbidityTreated', dashboard.turbidityTreated],
      ['phRaw', dashboard.phRaw],
      ['phTreated', dashboard.phTreated],
      ['chlorineResidual', dashboard.chlorineResidual],
      ['pressure', dashboard.pressure],
      ['flow', dashboard.flow],
      ['temperature', dashboard.temperature]
    ];

    for (const [parameter, kpi] of kpiEntries) {
      const alerts = this.evaluateKPI(parameter, kpi);
      newAlerts.push(...alerts);
    }

    // Actualizar alertas activas
    this.updateAlerts(newAlerts);

    return newAlerts;
  }

  /**
   * Evalúa un KPI individual y genera alertas si es necesario
   */
  private evaluateKPI(parameter: string, kpi: KPIValue): ThresholdAlert[] {
    const alerts: ThresholdAlert[] = [];
    const config = THRESHOLD_CONFIGS.find(c => c.parameter === parameter);

    if (!config || kpi.status === 'normal' || kpi.status === 'unknown') {
      return alerts;
    }

    // Alerta de nivel crítico
    if (kpi.status === 'critical') {
      const criticalAlert = this.createAlert(
        parameter,
        kpi,
        'critical',
        config,
        'CRÍTICO'
      );
      alerts.push(criticalAlert);
    }

    // Alerta de advertencia
    if (kpi.status === 'warning') {
      const warningAlert = this.createAlert(
        parameter,
        kpi,
        'warning',
        config,
        'ADVERTENCIA'
      );
      alerts.push(warningAlert);
    }

    return alerts;
  }

  /**
   * Crea una alerta individual
   */
  private createAlert(
    parameter: string,
    kpi: KPIValue,
    severity: 'warning' | 'critical',
    config: any,
    prefix: string
  ): ThresholdAlert {
    const thresholdValue = severity === 'critical' 
      ? (kpi.current < config.critical.min ? config.critical.min : config.critical.max)
      : (kpi.current < config.warning.min ? config.warning.min : config.warning.max);

    const exceededType = kpi.current < thresholdValue ? 'por debajo' : 'por encima';
    
    const message = `${prefix}: ${kpi.label} ${exceededType} del umbral (${kpi.current}${kpi.unit} vs ${thresholdValue}${kpi.unit})`;

    return {
      id: `${parameter}-${Date.now()}`,
      parameter,
      currentValue: kpi.current,
      thresholdValue,
      severity,
      message,
      timestamp: new Date(),
      acknowledged: false
    };
  }

  /**
   * Actualiza el estado de alertas activas
   */
  private updateAlerts(newAlerts: ThresholdAlert[]): void {
    // Filtrar alertas nuevas: solo agregar si NO existe una alerta activa del mismo parámetro/severidad
    const alertasParaAgregar = newAlerts.filter(newAlert => {
      const existeActiva = this.alertHistory.some(existingAlert => 
        !existingAlert.acknowledged && 
        existingAlert.parameter === newAlert.parameter &&
        existingAlert.severity === newAlert.severity
      );
      return !existeActiva; // Solo agregar si NO existe
    });

    // Agregar solo alertas únicas al historial
    this.alertHistory.push(...alertasParaAgregar);
    
    // Limitar tamaño del historial
    if (this.alertHistory.length > this.maxHistorySize) {
      this.alertHistory = this.alertHistory.slice(-this.maxHistorySize);
    }

    // Actualizar BehaviorSubject con alertas no reconocidas
    const unacknowledgedAlerts = this.alertHistory.filter(a => !a.acknowledged);
    this.alerts$.next(unacknowledgedAlerts);
  }

  /**
   * Reconoce (marca como leída) una alerta
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alertHistory.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }

    // Actualizar alertas activas
    const unacknowledgedAlerts = this.alertHistory.filter(a => !a.acknowledged);
    this.alerts$.next(unacknowledgedAlerts);
  }

  /**
   * Reconoce todas las alertas activas
   */
  acknowledgeAll(): void {
    this.alertHistory.forEach(a => a.acknowledged = true);
    this.alerts$.next([]);
  }

  /**
   * Obtiene el historial completo de alertas
   */
  getAlertHistory(): ThresholdAlert[] {
    return [...this.alertHistory];
  }

  /**
   * Limpia el historial de alertas
   */
  clearHistory(): void {
    this.alertHistory = [];
    this.alerts$.next([]);
  }

  /**
   * Obtiene conteo de alertas por severidad
   */
  getAlertCounts() {
    const activeAlerts = this.alertHistory.filter(a => !a.acknowledged);
    return {
      total: activeAlerts.length,
      critical: activeAlerts.filter(a => a.severity === 'critical').length,
      warning: activeAlerts.filter(a => a.severity === 'warning').length
    };
  }

  /**
   * Obtiene el color del badge según severidad
   */
  getSeverityColor(severity: 'warning' | 'critical'): string {
    return severity === 'critical' ? 'danger' : 'warning';
  }

  /**
   * Obtiene el ícono según severidad
   */
  getSeverityIcon(severity: 'warning' | 'critical'): string {
    return severity === 'critical' ? 'alert-circle' : 'warning';
  }

  /**
   * Reproduce notificación sonora (si está habilitada)
   */
  playAlertSound(severity: 'warning' | 'critical'): void {
    // Implementación futura: reproducir sonido según severidad
    // Por ahora solo log
    console.log(`🔔 Alerta de ${severity} generada`);
  }
}
