/**
 * Dashboard Models - BI Industrial
 * Modelos para KPIs, alertas de umbral y filtros de tiempo
 */

export type KPIStatus = 'normal' | 'warning' | 'critical' | 'unknown';
export type TrendDirection = 'up' | 'down' | 'stable';
export type TimeFilterPreset = '24h' | 'shift' | 'weekly' | 'custom';

/**
 * Valor de KPI individual con estado y tendencia
 */
export interface KPIValue {
  current: number;
  previous?: number;
  status: KPIStatus;
  threshold: {
    min: number;
    max: number;
    warningMin?: number;
    warningMax?: number;
  };
  trend: TrendDirection;
  unit: string;
  label: string;
}

/**
 * Dashboard completo de KPIs operacionales
 */
export interface KPIDashboard {
  // KPIs críticos de calidad de agua
  turbidityRaw: KPIValue;         // Turbedad agua cruda (FTU)
  turbidityTreated: KPIValue;     // Turbedad agua tratada (FTU)
  phRaw: KPIValue;                // pH agua cruda
  phTreated: KPIValue;            // pH agua tratada
  chlorineResidual: KPIValue;     // Cloro residual (mg/L)
  
  // KPIs operacionales
  pressure: KPIValue;             // Presión PSI
  flow: KPIValue;                 // Caudal (m3/h)
  temperature: KPIValue;          // Temperatura (°C)
  
  // Metadatos
  lastUpdate: Date;
  dataPoints: number;
  timeRange: {
    start: Date;
    end: Date;
  };
}

/**
 * Alerta de umbral excedido
 */
export interface ThresholdAlert {
  id: string;
  parameter: string;
  currentValue: number;
  thresholdValue: number;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

/**
 * Configuración de filtro de tiempo
 */
export interface TimeFilter {
  preset: TimeFilterPreset;
  label: string;
  start: Date;
  end: Date;
  refreshInterval?: number; // milisegundos
}

/**
 * Presets de filtros de tiempo predefinidos
 */
export const TIME_FILTER_PRESETS: Omit<TimeFilter, 'start' | 'end'>[] = [
  { preset: '24h', label: 'Últimas 24h', refreshInterval: 60000 },
  { preset: 'shift', label: 'Turno Actual', refreshInterval: 300000 },
  { preset: 'weekly', label: 'Comparativo Semanal', refreshInterval: 0 },
  { preset: 'custom', label: 'Personalizado', refreshInterval: 0 }
];

/**
 * Configuración de umbrales por parámetro
 */
export interface ThresholdConfig {
  parameter: string;
  unit: string;
  critical: { min: number; max: number };
  warning: { min: number; max: number };
  normal: { min: number; max: number };
}

/**
 * Umbrales industriales para planta de tratamiento de agua
 * Basados en normas OMS y estándares de agua potable
 */
export const THRESHOLD_CONFIGS: ThresholdConfig[] = [
  {
    parameter: 'turbidityRaw',
    unit: 'FTU',
    critical: { min: 0, max: 50 },
    warning: { min: 30, max: 40 },
    normal: { min: 5, max: 30 }
  },
  {
    parameter: 'turbidityTreated',
    unit: 'FTU',
    critical: { min: 0, max: 1 },      // Crítico: > 1 FTU (fuera norma WHO)
    warning: { min: 0, max: 0.85 },    // Advertencia: 0.85-1 FTU (cerca del límite)
    normal: { min: 0, max: 0.5 }       // Normal: 0-0.5 FTU (óptimo WHO)
  },
  {
    parameter: 'phRaw',
    unit: '',
    critical: { min: 5.5, max: 9.5 },
    warning: { min: 6.0, max: 9.0 },
    normal: { min: 6.5, max: 8.5 }
  },
  {
    parameter: 'phTreated',
    unit: '',
    critical: { min: 6.0, max: 9.0 },
    warning: { min: 6.5, max: 8.5 },
    normal: { min: 6.8, max: 8.0 }
  },
  {
    parameter: 'chlorineResidual',
    unit: 'mg/L',
    critical: { min: 0, max: 5 },
    warning: { min: 0.3, max: 2 },
    normal: { min: 0.5, max: 1.5 }
  },
  {
    parameter: 'pressure',
    unit: 'PSI',
    critical: { min: 10, max: 100 },
    warning: { min: 20, max: 80 },
    normal: { min: 30, max: 70 }
  },
  {
    parameter: 'flow',
    unit: 'm³/h',
    critical: { min: 0, max: 500 },
    warning: { min: 50, max: 400 },
    normal: { min: 100, max: 350 }
  },
  {
    parameter: 'temperature',
    unit: '°C',
    critical: { min: 5, max: 40 },
    warning: { min: 10, max: 35 },
    normal: { min: 15, max: 30 }
  }
];

/**
 * Datos de tendencia para gráficas
 */
export interface TrendData {
  parameter: string;
  unit: string;
  data: {
    timestamp: Date;
    value: number;
  }[];
}

/**
 * Resumen de estadísticas operacionales
 */
export interface OperationalStats {
  totalRecords: number;
  activeAlerts: number;
  normalParameters: number;
  warningParameters: number;
  criticalParameters: number;
  lastOperatorId?: number;
  shiftStartTime?: Date;
}
