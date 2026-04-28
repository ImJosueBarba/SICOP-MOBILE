import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, retry, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { LoadingService } from './loading.service';

/**
 * Servicio centralizado para todas las peticiones HTTP
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_TIMEOUT = 30000; // 30 segundos
  private readonly RETRY_ATTEMPTS = 1;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private loadingService: LoadingService
  ) {}

  /**
   * GET request
   */
  get<T>(
    endpoint: string,
    params?: any,
    options: RequestOptions = {}
  ): Observable<T> {
    const httpOptions = this.buildHttpOptions(params, options);

    if (options.showLoading !== false) {
      this.loadingService.show(options.loadingMessage);
    }

    return this.http.get<T>(this.getFullUrl(endpoint), httpOptions).pipe(
      timeout(options.timeout || this.API_TIMEOUT),
      retry(options.retryAttempts !== undefined ? options.retryAttempts : this.RETRY_ATTEMPTS),
      catchError(error => this.handleError(error, options)),
      finalize(() => {
        if (options.showLoading !== false) {
          this.loadingService.hide();
        }
      })
    );
  }

  /**
   * POST request
   */
  post<T>(
    endpoint: string,
    body: any,
    options: RequestOptions = {}
  ): Observable<T> {
    const httpOptions = this.buildHttpOptions(null, options);

    if (options.showLoading !== false) {
      this.loadingService.show(options.loadingMessage);
    }

    return this.http.post<T>(this.getFullUrl(endpoint), body, httpOptions).pipe(
      timeout(options.timeout || this.API_TIMEOUT),
      retry(options.retryAttempts !== undefined ? options.retryAttempts : 0),
      catchError(error => this.handleError(error, options)),
      finalize(() => {
        if (options.showLoading !== false) {
          this.loadingService.hide();
        }
      })
    );
  }

  /**
   * PUT request
   */
  put<T>(
    endpoint: string,
    body: any,
    options: RequestOptions = {}
  ): Observable<T> {
    const httpOptions = this.buildHttpOptions(null, options);

    if (options.showLoading !== false) {
      this.loadingService.show(options.loadingMessage);
    }

    return this.http.put<T>(this.getFullUrl(endpoint), body, httpOptions).pipe(
      timeout(options.timeout || this.API_TIMEOUT),
      catchError(error => this.handleError(error, options)),
      finalize(() => {
        if (options.showLoading !== false) {
          this.loadingService.hide();
        }
      })
    );
  }

  /**
   * PATCH request
   */
  patch<T>(
    endpoint: string,
    body: any,
    options: RequestOptions = {}
  ): Observable<T> {
    const httpOptions = this.buildHttpOptions(null, options);

    if (options.showLoading !== false) {
      this.loadingService.show(options.loadingMessage);
    }

    return this.http.patch<T>(this.getFullUrl(endpoint), body, httpOptions).pipe(
      timeout(options.timeout || this.API_TIMEOUT),
      catchError(error => this.handleError(error, options)),
      finalize(() => {
        if (options.showLoading !== false) {
          this.loadingService.hide();
        }
      })
    );
  }

  /**
   * DELETE request
   */
  delete<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Observable<T> {
    const httpOptions = this.buildHttpOptions(null, options);

    if (options.showLoading !== false) {
      this.loadingService.show(options.loadingMessage);
    }

    return this.http.delete<T>(this.getFullUrl(endpoint), httpOptions).pipe(
      timeout(options.timeout || this.API_TIMEOUT),
      catchError(error => this.handleError(error, options)),
      finalize(() => {
        if (options.showLoading !== false) {
          this.loadingService.hide();
        }
      })
    );
  }

  /**
   * POST con FormData (para login OAuth2)
   */
  postForm<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Observable<T> {
    if (options.showLoading !== false) {
      this.loadingService.show(options.loadingMessage);
    }

    // No enviar Content-Type header, el navegador lo configurará automáticamente
    const httpOptions = {
      headers: options.headers || new HttpHeaders()
    };

    return this.http.post<T>(this.getFullUrl(endpoint), formData, httpOptions).pipe(
      timeout(options.timeout || this.API_TIMEOUT),
      catchError(error => this.handleError(error, options)),
      finalize(() => {
        if (options.showLoading !== false) {
          this.loadingService.hide();
        }
      })
    );
  }

  /**
   * Construye la URL completa
   */
  private getFullUrl(endpoint: string): string {
    // Si el endpoint ya tiene el protocolo, usarlo directamente
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }

    // Si el endpoint ya incluye /api, usarlo directamente
    if (endpoint.startsWith('/api')) {
      return `${environment.apiUrl.replace('/api', '')}${endpoint}`;
    }

    // Si el endpoint empieza con /, quitarlo
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    
    return `${environment.apiUrl}/${cleanEndpoint}`;
  }

  /**
   * Construye las opciones HTTP
   */
  private buildHttpOptions(params?: any, options: RequestOptions = {}): { params: HttpParams; headers: HttpHeaders } {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return {
      params: httpParams,
      headers: options.headers || new HttpHeaders()
    };
  }

  /**
   * Maneja errores de forma centralizada
   */
  private handleError(error: any, options: RequestOptions): Observable<never> {
    console.error('API Error:', error);

    // Si se especificó un handler personalizado, usarlo
    if (options.customErrorHandler) {
      return throwError(() => error);
    }

    // Si está configurado para no mostrar errores, solo propagarlo
    if (options.silentError) {
      return throwError(() => error);
    }

    // Timeout error
    if (error instanceof TimeoutError) {
      this.errorHandler.showError('La petición ha tardado demasiado tiempo.');
    } else {
      // Manejo de error HTTP estándar
      this.errorHandler.handleHttpError(error);
    }

    return throwError(() => error);
  }
}

/**
 * Opciones para las peticiones HTTP
 */
export interface RequestOptions {
  headers?: HttpHeaders;
  showLoading?: boolean;
  loadingMessage?: string;
  silentError?: boolean;
  customErrorHandler?: boolean;
  timeout?: number;
  retryAttempts?: number;
}
