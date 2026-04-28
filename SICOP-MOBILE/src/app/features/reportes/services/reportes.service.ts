import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import {
  ControlOperacion,
  MonitoreoFisicoquimico,
  ControlCloroLibre,
  ProduccionFiltro,
  ConsumoQuimicoMensual,
  ConsumoQuimicoDiario,
  Reactivo,
  DateRangeFilter,
  MonthYearFilter
} from '../models/reportes.model';

/**
 * Servicio refactorizado de reportes con Clean Architecture
 */
@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  
  constructor(private apiService: ApiService) {}

  /**
   * Obtiene registros de Control de Operación
   */
  getControlOperacion(filter?: DateRangeFilter): Observable<ControlOperacion[]> {
    return this.apiService.get<ControlOperacion[]>(
      API_CONSTANTS.REPORTES.CONTROL_OPERACION,
      filter,
      { loadingMessage: 'Cargando control de operación...' }
    );
  }

  /**
   * Crea un nuevo registro de Control de Operación
   */
  createControlOperacion(data: Partial<ControlOperacion>): Observable<ControlOperacion> {
    return this.apiService.post<ControlOperacion>(
      API_CONSTANTS.REPORTES.CONTROL_OPERACION,
      data,
      { loadingMessage: 'Guardando registro...' }
    );
  }

  /**
   * Actualiza un registro de Control de Operación
   */
  updateControlOperacion(id: number, data: Partial<ControlOperacion>): Observable<ControlOperacion> {
    return this.apiService.put<ControlOperacion>(
      `${API_CONSTANTS.REPORTES.CONTROL_OPERACION}/${id}`,
      data,
      { loadingMessage: 'Actualizando registro...' }
    );
  }

  /**
   * Obtiene registros de Monitoreo Fisicoquímico
   */
  getMonitoreoFisicoquimico(filter?: DateRangeFilter): Observable<MonitoreoFisicoquimico[]> {
    return this.apiService.get<MonitoreoFisicoquimico[]>(
      API_CONSTANTS.REPORTES.MONITOREO_FISICOQUIMICO,
      filter,
      { loadingMessage: 'Cargando monitoreo fisicoquímico...' }
    );
  }

  /**
   * Crea un nuevo registro de Monitoreo Fisicoquímico
   */
  createMonitoreoFisicoquimico(data: Partial<MonitoreoFisicoquimico>): Observable<MonitoreoFisicoquimico> {
    return this.apiService.post<MonitoreoFisicoquimico>(
      API_CONSTANTS.REPORTES.MONITOREO_FISICOQUIMICO,
      data,
      { loadingMessage: 'Guardando registro...' }
    );
  }

  /**
   * Obtiene registros de Control de Cloro Libre
   */
  getControlCloroLibre(filter?: DateRangeFilter): Observable<ControlCloroLibre[]> {
    return this.apiService.get<ControlCloroLibre[]>(
      API_CONSTANTS.REPORTES.CONTROL_CLORO,
      filter,
      { loadingMessage: 'Cargando control de cloro...' }
    );
  }

  /**
   * Obtiene registros de Producción de Filtros
   */
  getProduccionFiltros(filter?: DateRangeFilter): Observable<ProduccionFiltro[]> {
    return this.apiService.get<ProduccionFiltro[]>(
      API_CONSTANTS.REPORTES.PRODUCCION_FILTROS,
      filter,
      { loadingMessage: 'Cargando producción filtros...' }
    );
  }

  /**
   * Obtiene registros de Consumo Químico Mensual
   */
  getConsumoQuimicoMensual(filter?: MonthYearFilter): Observable<ConsumoQuimicoMensual[]> {
    return this.apiService.get<ConsumoQuimicoMensual[]>(
      API_CONSTANTS.REPORTES.CONSUMO_MENSUAL,
      filter,
      { loadingMessage: 'Cargando consumo mensual...' }
    );
  }

  /**
   * Obtiene registros de Consumo Químico Diario
   */
  getConsumoQuimicoDiario(filter?: DateRangeFilter): Observable<ConsumoQuimicoDiario[]> {
    return this.apiService.get<ConsumoQuimicoDiario[]>(
      API_CONSTANTS.REPORTES.CONSUMO_DIARIO,
      filter,
      { loadingMessage: 'Cargando consumo diario...' }
    );
  }

  /**
   * Obtiene la lista de reactivos/químicos
   */
  getReactivos(): Observable<Reactivo[]> {
    return this.apiService.get<Reactivo[]>(
      API_CONSTANTS.REPORTES.REACTIVOS,
      undefined,
      { showLoading: false }
    );
  }

  /**
   * MÉTODOS AUXILIARES PARA PROCESAMIENTO DE DATOS
   */

  /**
   * Filtra datos por rango de fechas (lado cliente)
   */
  filterByDateRange<T extends { fecha: string }>(
    data: T[],
    startDate?: string,
    endDate?: string
  ): T[] {
    if (!startDate && !endDate) {
      return data;
    }

    return data.filter(item => {
      const itemDate = new Date(item.fecha);
      
      if (startDate && itemDate < new Date(startDate)) {
        return false;
      }
      
      if (endDate && itemDate > new Date(endDate)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Calcula totales para Control de Operación
   */
  calculateControlOperacionTotals(data: ControlOperacion[]): {
    promedio_turbedad_at: number;
    promedio_ph_at: number;
    total_registros: number;
  } {
    if (data.length === 0) {
      return {
        promedio_turbedad_at: 0,
        promedio_ph_at: 0,
        total_registros: 0
      };
    }

    const total_turbedad = data.reduce((sum, item) => sum + (item.turbedad_at || 0), 0);
    const total_ph = data.reduce((sum, item) => sum + (item.ph_at || 0), 0);

    return {
      promedio_turbedad_at: total_turbedad / data.length,
      promedio_ph_at: total_ph / data.length,
      total_registros: data.length
    };
  }

  /**
   * Exporta datos a formato CSV (básico)
   */
  exportToCSV<T>(data: T[], filename: string): void {
    if (data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0] as any).join(',');
    const rows = data.map(item =>
      Object.values(item as any)
        .map(val => `"${val}"`)
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
