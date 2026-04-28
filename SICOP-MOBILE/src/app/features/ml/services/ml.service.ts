import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import {
  PredictionRequest,
  PredictionResponse,
  TrainingRequest,
  TrainingResponse,
  AnomalyResponse,
  ModelInfo,
  SystemStats,
  ReloadResponse,
  AnomalyFilter
} from '../models/ml.model';

/**
 * Servicio refactorizado de Machine Learning con Clean Architecture
 */
@Injectable({
  providedIn: 'root'
})
export class MlService {
  
  constructor(private apiService: ApiService) {}

  /**
   * Realiza una predicción de consumo de químicos
   */
  predict(data: PredictionRequest): Observable<PredictionResponse> {
    return this.apiService.post<PredictionResponse>(
      API_CONSTANTS.ML.PREDICT,
      data,
      { 
        loadingMessage: 'Realizando predicción...',
        showLoading: true
      }
    );
  }

  /**
   * Entrena un nuevo modelo con datos históricos
   */
  trainModel(params?: TrainingRequest): Observable<TrainingResponse> {
    return this.apiService.post<TrainingResponse>(
      API_CONSTANTS.ML.TRAIN,
      params || {},
      { 
        loadingMessage: 'Entrenando modelo... Esto puede tardar varios minutos.',
        timeout: 300000 // 5 minutos
      }
    );
  }

  /**
   * Obtiene anomalías detectadas
   */
  getAnomalies(filter?: AnomalyFilter): Observable<AnomalyResponse> {
    const params: any = {};
    
    if (filter?.start_date) {
      params.start_date = filter.start_date;
    }
    if (filter?.end_date) {
      params.end_date = filter.end_date;
    }
    if (filter?.days !== undefined) {
      params.days = filter.days;
    }
    
    return this.apiService.get<AnomalyResponse>(
      API_CONSTANTS.ML.ANOMALIES,
      params,
      { loadingMessage: 'Cargando anomalías...' }
    );
  }

  /**
   * Obtiene información del modelo actual
   */
  getModelInfo(): Observable<ModelInfo> {
    return this.apiService.get<ModelInfo>(
      API_CONSTANTS.ML.MODEL_INFO,
      undefined,
      { showLoading: false }
    );
  }

  /**
   * Obtiene estadísticas del sistema ML
   */
  getStats(): Observable<SystemStats> {
    return this.apiService.get<SystemStats>(
      API_CONSTANTS.ML.STATS,
      undefined,
      { showLoading: false }
    );
  }

  /**
   * Recarga el modelo más reciente sin reiniciar el servidor
   */
  reloadModel(): Observable<ReloadResponse> {
    return this.apiService.post<ReloadResponse>(
      API_CONSTANTS.ML.RELOAD_MODEL,
      {},
      { loadingMessage: 'Recargando modelo...' }
    );
  }

  /**
   * MÉTODOS AUXILIARES
   */

  /**
   * Valida los datos de entrada para predicción
   */
  validatePredictionRequest(data: PredictionRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validación de rangos razonables
    if (data.turbedad_at < 0 || data.turbedad_at > 1000) {
      errors.push('Turbedad AT debe estar entre 0 y 1000 NTU');
    }

    if (data.ph_at < 0 || data.ph_at > 14) {
      errors.push('pH AT debe estar entre 0 y 14');
    }

    if (data.temperatura_ac < 0 || data.temperatura_ac > 50) {
      errors.push('Temperatura debe estar entre 0°C y 50°C');
    }

    if (data.caudal_total && (data.caudal_total < 0 || data.caudal_total > 100000)) {
      errors.push('Caudal debe estar entre 0 y 100000 m³/día');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Filtra anomalías por severidad
   */
  filterAnomaliesBySeverity(
    anomalies: AnomalyResponse,
    severity: 'critico' | 'sospechoso' | 'normal'
  ): AnomalyResponse {
    return {
      ...anomalies,
      anomalies: anomalies.anomalies.filter(a => a.severity === severity),
      anomalies_detected: anomalies.anomalies.filter(a => a.severity === severity).length
    };
  }

  /**
   * Obtiene solo anomalías críticas
   */
  getCriticalAnomalies(anomalies: AnomalyResponse): AnomalyResponse {
    return this.filterAnomaliesBySeverity(anomalies, 'critico');
  }

  /**
   * Calcula el promedio de confianza de predicciones
   */
  calculateAverageConfidence(predictions: PredictionResponse[]): number {
    if (predictions.length === 0) {
      return 0;
    }

    const totalConfidence = predictions.reduce((sum, pred) => sum + pred.confidence, 0);
    return totalConfidence / predictions.length;
  }

  /**
   * Formatea métricas del modelo para mostrar en UI
   */
  formatMetrics(metrics: { [key: string]: number }): Array<{ key: string; value: string; label: string }> {
    const metricLabels: { [key: string]: string } = {
      r2: 'R² Score',
      rmse: 'RMSE',
      mae: 'MAE',
      mape: 'MAPE (%)'
    };

    return Object.entries(metrics).map(([key, value]) => ({
      key,
      value: value.toFixed(4),
      label: metricLabels[key] || key.toUpperCase()
    }));
  }

  /**
   * Obtiene el estado del modelo (basado en métricas)
   */
  getModelQuality(modelInfo: ModelInfo): 'excelente' | 'bueno' | 'regular' | 'pobre' {
    const r2 = modelInfo.metrics.r2 || 0;

    if (r2 >= 0.9) return 'excelente';
    if (r2 >= 0.75) return 'bueno';
    if (r2 >= 0.5) return 'regular';
    return 'pobre';
  }

  /**
   * Crea valores por defecto para el formulario de predicción
   */
  getDefaultPredictionValues(): PredictionRequest {
    return {
      turbedad_ac: 15.5,
      turbedad_at: 0.3,
      ph_ac: 7.2,
      ph_at: 7.5,
      temperatura_ac: 18.5,
      caudal_total: 3500,
      dosis_sulfato: 42,
      dosis_cal: 12,
      cloro_residual: 0.9
    };
  }
}
