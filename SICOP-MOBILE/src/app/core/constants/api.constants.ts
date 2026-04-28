/**
 * Constantes de API y configuración global
 */

export const API_CONSTANTS = {
  // Endpoints de autenticación
  AUTH: {
    LOGIN: '/auth/token',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },

  // Endpoints de reportes
  REPORTES: {
    CONTROL_OPERACION: '/control-operacion',
    MONITOREO_FISICOQUIMICO: '/monitoreo-fisicoquimico',
    CONTROL_CLORO: '/control-cloro',
    PRODUCCION_FILTROS: '/produccion-filtros',
    CONSUMO_MENSUAL: '/consumo-mensual',
    CONSUMO_DIARIO: '/consumo-diario',
    REACTIVOS: '/quimicos'
  },

  // Endpoints de ML
  ML: {
    PREDICT: '/ml/predict',
    TRAIN: '/ml/train',
    ANOMALIES: '/ml/anomalies',
    MODEL_INFO: '/ml/model/info',
    STATS: '/ml/stats',
    RELOAD_MODEL: '/ml/model/reload'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  REMEMBER_ME: 'remember_me'
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  SERVER_ERROR: 'Error en el servidor. Intenta nuevamente más tarde.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  TIMEOUT: 'La petición ha tardado demasiado tiempo.',
  UNKNOWN: 'Ha ocurrido un error inesperado.'
} as const;
