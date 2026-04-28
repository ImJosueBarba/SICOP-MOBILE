import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { HTTP_STATUS } from '../constants/api.constants';

/**
 * Interceptor para manejo global de errores HTTP
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  return next(req).pipe(
    tap(event => {
      // Aquí se podría agregar logging de respuestas exitosas si se necesita
    }),
    catchError((error: HttpErrorResponse) => {
      // Manejo específico de errores de autenticación
      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        // Limpiar datos de autenticación
        storageService.clearAuthData();
        
        // Redirigir al login si no estamos ya ahí
        const currentUrl = router.url;
        if (!currentUrl.includes('/login')) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: currentUrl }
          });
        }
      }

      // Manejo de errores de prohibición
      if (error.status === HTTP_STATUS.FORBIDDEN) {
        console.warn('Acceso denegado:', error.url);
        // Podrías redirigir a una página de "Acceso Denegado"
      }

      // Logging de errores para debugging
      console.error('HTTP Error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.error?.detail || error.message,
        timestamp: new Date().toISOString()
      });

      // Propagar el error para que lo maneje el servicio o componente
      return throwError(() => error);
    })
  );
};
