/**
 * Modelos de respuesta de la API
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface HttpErrorResponse {
  error: {
    detail?: string;
    message?: string;
    errors?: any[];
  };
  status: number;
  statusText: string;
  url?: string;
}
