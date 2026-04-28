import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

/**
 * Interceptor para agregar el token JWT a todas las peticiones HTTP
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService);
  
  // Obtener token del storage
  const token = storageService.getAuthToken();

  // URLs públicas que no requieren autenticación
  const publicEndpoints = [
    '/auth/token',
    '/auth/login',
    '/auth/register'
  ];

  // Verificar si la URL es pública
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    req.url.includes(endpoint)
  );

  // Si hay token y no es una URL pública, agregar header de autorización
  if (token && !isPublicEndpoint) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Agregar headers adicionales comunes
  req = req.clone({
    setHeaders: {
      'Content-Type': req.headers.get('Content-Type') || 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(req);
};
