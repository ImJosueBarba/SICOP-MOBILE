import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/api.constants';

/**
 * Servicio para manejo centralizado de errores
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  constructor(private toastService: ToastService) {}

  /**
   * Maneja errores HTTP y muestra mensajes apropiados
   */
  async handleHttpError(error: any): Promise<void> {
    let message: string;

    if (error instanceof HttpErrorResponse) {
      // Errores HTTP específicos
      switch (error.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          message = ERROR_MESSAGES.UNAUTHORIZED;
          break;

        case HTTP_STATUS.FORBIDDEN:
          message = ERROR_MESSAGES.FORBIDDEN;
          break;

        case HTTP_STATUS.NOT_FOUND:
          message = ERROR_MESSAGES.NOT_FOUND;
          break;

        case HTTP_STATUS.BAD_REQUEST:
          message = this.extractErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR;
          break;

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          message = ERROR_MESSAGES.SERVER_ERROR;
          break;

        case 0:
          // Error de red (sin conexión)
          message = ERROR_MESSAGES.NETWORK_ERROR;
          break;

        default:
          message = this.extractErrorMessage(error) || ERROR_MESSAGES.UNKNOWN;
      }
    } else {
      // Errores no HTTP (runtime errors, etc.)
      message = error?.message || ERROR_MESSAGES.UNKNOWN;
    }

    await this.toastService.error(message);
    this.logError(error, message);
  }

  /**
   * Extrae el mensaje de error del response
   */
  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (!error.error) {
      return null;
    }

    // FastAPI devuelve errores en formato { detail: "mensaje" }
    if (typeof error.error.detail === 'string') {
      return error.error.detail;
    }

    // Si detail es un array de errores de validación
    if (Array.isArray(error.error.detail)) {
      const firstError = error.error.detail[0];
      return firstError?.msg || firstError?.message || null;
    }

    // Formato genérico { message: "mensaje" }
    if (error.error.message) {
      return error.error.message;
    }

    return null;
  }

  /**
   * Muestra un error personalizado
   */
  async showError(message: string): Promise<void> {
    await this.toastService.error(message);
    this.logError(message, message);
  }

  /**
   * Muestra un mensaje de éxito
   */
  async showSuccess(message: string): Promise<void> {
    await this.toastService.success(message);
  }

  /**
   * Muestra una advertencia
   */
  async showWarning(message: string): Promise<void> {
    await this.toastService.warning(message);
  }

  /**
   * Muestra información
   */
  async showInfo(message: string): Promise<void> {
    await this.toastService.info(message);
  }

  /**
   * Registra el error en consola (y podría enviarse a un servicio de logging)
   */
  private logError(error: any, userMessage: string): void {
    console.error('Error logged:', {
      timestamp: new Date().toISOString(),
      message: userMessage,
      error,
      stack: error?.stack
    });

    // Aquí se podría enviar a un servicio de monitoreo como Sentry
    // this.sentryService.captureException(error);
  }

  /**
   * Maneja errores de validación de formularios
   */
  getValidationErrorMessage(error: any): string {
    if (!error) {
      return ERROR_MESSAGES.VALIDATION_ERROR;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    return ERROR_MESSAGES.VALIDATION_ERROR;
  }

  /**
   * Verifica si un error es de tipo de autenticación
   */
  isAuthError(error: any): boolean {
    return error instanceof HttpErrorResponse && 
           (error.status === HTTP_STATUS.UNAUTHORIZED || 
            error.status === HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Verifica si un error es de tipo de red
   */
  isNetworkError(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status === 0;
  }
}
