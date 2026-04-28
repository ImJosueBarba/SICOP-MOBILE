import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para interactuar con los endpoints de Machine Learning del backend.
 * Maneja predicciones, detección de anomalías y gestión de modelos.
 */
@Injectable({
  providedIn: 'root'
})
export class MlService {
  private apiUrl = `${environment.apiUrl}/ml`;

  constructor(private http: HttpClient) { }

  /**
   * Realiza una predicción de consumo de químicos.
   * @param data Datos operacionales de entrada
   */
  predict(data: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${this.apiUrl}/predict`, data);
  }

  /**
   * Entrena un nuevo modelo con datos históricos.
   * @param params Parámetros de entrenamiento
   */
  trainModel(params: TrainingRequest): Observable<TrainingResponse> {
    return this.http.post<TrainingResponse>(`${this.apiUrl}/train`, params);
  }

  /**
   * Obtiene anomalías detectadas en un rango de fechas.
   * @param startDate Fecha inicial (opcional)
   * @param endDate Fecha final (opcional)
   * @param days Últimos N días (opcional, por defecto 7)
   */
  getAnomalies(startDate?: string, endDate?: string, days: number = 7): Observable<AnomalyResponse> {
    let url = `${this.apiUrl}/anomalies?days=${days}`;
    
    if (startDate) {
      url += `&start_date=${startDate}`;
    }
    if (endDate) {
      url += `&end_date=${endDate}`;
    }
    
    return this.http.get<AnomalyResponse>(url);
  }

  /**
   * Obtiene información del modelo actual.
   */
  getModelInfo(): Observable<ModelInfo> {
    return this.http.get<ModelInfo>(`${this.apiUrl}/model/info`);
  }

  /**
   * Obtiene estadísticas del sistema ML.
   */
  getStats(): Observable<SystemStats> {
    return this.http.get<SystemStats>(`${this.apiUrl}/stats`);
  }

  /**
   * Recarga el modelo más reciente sin reiniciar el servidor.
   */
  reloadModel(): Observable<ReloadResponse> {
    return this.http.post<ReloadResponse>(`${this.apiUrl}/model/reload`, {});
  }
}

// ============================================================================
// Interfaces de Tipos
// ============================================================================

export interface PredictionRequest {
  turbedad_at: number;
  turbedad_ac: number;
  ph_at: number;
  ph_ac: number;
  temperatura: number;
  cloro_residual: number;
  conductividad_at: number;
  conductividad_ac: number;
  caudal: number;
  presion_entrada: number;
  presion_salida: number;
  solidos_totales: number;
}

export interface PredictionResponse {
  sulfato_aluminio: number;
  polielectrolito: number;
  cal_hidratada: number;
  cloro_gas: number;
  confidence: number;
  estimated_cost: number;
}

export interface TrainingRequest {
  start_date?: string;
  end_date?: string;
  perform_cv?: boolean;
}

export interface TrainingResponse {
  success: boolean;
  model_path: string;
  best_model: string;
  metrics: any;
  training_samples: number;
  message?: string;
}

export interface AnomalyResponse {
  total_records: number;
  anomalies_detected: number;
  anomalies: Anomaly[];
}

export interface Anomaly {
  timestamp: string;
  parameter: string;
  value: number;
  is_anomaly: boolean;
  severity: 'normal' | 'sospechoso' | 'critico';
  anomaly_score: number;
  reason?: string;
}

export interface ModelInfo {
  model_type: string;
  version: string;
  trained_at: string;
  training_records: number;
  features: string[];
  targets: string[];
  metrics: {
    [key: string]: number;
  };
}

export interface SystemStats {
  total_operational_records: number;
  total_consumption_records: number;
  date_range: {
    start: string;
    end: string;
  };
  total_physicochemical_records?: number;
  total_production_records?: number;
  database_status: string;
}

export interface ReloadResponse {
  success: boolean;
  message: string;
  model_version: string;
}
