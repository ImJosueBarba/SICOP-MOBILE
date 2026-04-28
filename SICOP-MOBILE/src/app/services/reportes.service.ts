import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ControlOperacion,
  MonitoreoFisicoquimico,
  ControlCloroLibre,
  ProduccionFiltro,
  ConsumoQuimicoMensual,
  ConsumoQuimicoDiario,
  Reactivo
} from '../models/reportes.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:8000/api'; // Ajustar según tu configuración

  constructor(private http: HttpClient) {}

  // Control de Operación
  getControlOperacion(fechaInicio?: string, fechaFin?: string): Observable<ControlOperacion[]> {
    let params: any = {};
    if (fechaInicio) params['fecha_inicio'] = fechaInicio;
    if (fechaFin) params['fecha_fin'] = fechaFin;
    return this.http.get<ControlOperacion[]>(`${this.apiUrl}/control-operacion`, { params });
  }

  // Monitoreo Fisicoquímico
  getMonitoreoFisicoquimico(fechaInicio?: string, fechaFin?: string): Observable<MonitoreoFisicoquimico[]> {
    let params: any = {};
    if (fechaInicio) params['fecha_inicio'] = fechaInicio;
    if (fechaFin) params['fecha_fin'] = fechaFin;
    return this.http.get<MonitoreoFisicoquimico[]>(`${this.apiUrl}/monitoreo-fisicoquimico`, { params });
  }

  // Control de Cloro Libre
  getControlCloroLibre(fechaInicio?: string, fechaFin?: string): Observable<ControlCloroLibre[]> {
    let params: any = {};
    if (fechaInicio) params['fecha_inicio'] = fechaInicio;
    if (fechaFin) params['fecha_fin'] = fechaFin;
    return this.http.get<ControlCloroLibre[]>(`${this.apiUrl}/control-cloro`, { params });
  }

  // Producción de Filtros
  getProduccionFiltros(fechaInicio?: string, fechaFin?: string): Observable<ProduccionFiltro[]> {
    let params: any = {};
    if (fechaInicio) params['fecha_inicio'] = fechaInicio;
    if (fechaFin) params['fecha_fin'] = fechaFin;
    return this.http.get<ProduccionFiltro[]>(`${this.apiUrl}/produccion-filtros`, { params });
  }

  // Consumo Químico Mensual
  getConsumoQuimicoMensual(mes?: number, anio?: number): Observable<ConsumoQuimicoMensual[]> {
    let params: any = {};
    if (mes) params['mes'] = mes.toString();
    if (anio) params['anio'] = anio.toString();
    return this.http.get<ConsumoQuimicoMensual[]>(`${this.apiUrl}/consumo-mensual`, { params });
  }

  // Consumo Diario
  getConsumoQuimicoDiario(fechaInicio?: string, fechaFin?: string): Observable<ConsumoQuimicoDiario[]> {
    let params: any = {};
    if (fechaInicio) params['fecha_inicio'] = fechaInicio;
    if (fechaFin) params['fecha_fin'] = fechaFin;
    return this.http.get<ConsumoQuimicoDiario[]>(`${this.apiUrl}/consumo-diario`, { params });
  }

  // Reactivos
  getReactivos(): Observable<Reactivo[]> {
    return this.http.get<Reactivo[]>(`${this.apiUrl}/quimicos`);
  }
}
