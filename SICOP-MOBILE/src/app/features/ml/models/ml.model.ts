/**
 * Modelos de datos para el módulo de Machine Learning
 */

export interface PredictionRequest {
  turbedad_ac: number;        // Turbidez agua cruda (0-500 FTU)
  turbedad_at: number;        // Turbidez agua tratada (0-10 FTU)
  ph_ac: number;              // pH agua cruda (6.0-9.5)
  ph_at: number;              // pH agua tratada (6.0-9.5)
  temperatura_ac: number;     // Temperatura agua cruda (0-50°C)
  caudal_total?: number;      // Caudal total opcional (m³/día)
  dosis_sulfato?: number;     // Dosis sulfato opcional (kg/día)
  dosis_cal?: number;         // Dosis cal opcional (kg/día)
  cloro_residual?: number;    // Cloro residual opcional (0-5 mg/L)
}

export interface PredictionResponse {
  sulfato_kg: number;           // Sulfato de aluminio en kg
  cal_kg: number;               // Cal hidratada en kg
  hipoclorito_kg: number;       // Hipoclorito de sodio en kg
  cloro_gas_kg: number;         // Cloro gas en kg
  confidence: number;           // Confianza del modelo (0-1)
  model_name: string;           // Nombre del modelo
  estimated_cost_usd: number;   // Costo estimado en USD
  prediction_date: string;      // Fecha de predicción ISO
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
  metrics: ModelMetrics;
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
  metrics: ModelMetrics;
}

export interface ModelMetrics {
  r2?: number;
  rmse?: number;
  mae?: number;
  mape?: number;
  [key: string]: number | undefined;
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

export interface AnomalyFilter {
  start_date?: string;
  end_date?: string;
  days?: number;
  severity?: 'normal' | 'sospechoso' | 'critico';
}
