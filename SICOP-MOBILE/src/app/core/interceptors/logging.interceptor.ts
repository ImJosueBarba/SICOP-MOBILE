import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Interceptor para logging de peticiones HTTP (solo en desarrollo)
 */
export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  // Solo activar en desarrollo
  if (!environment.production) {
    const startTime = Date.now();

    return next(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const elapsedTime = Date.now() - startTime;
          console.log(`%c[HTTP] ${req.method} ${req.url}`, 'color: #4CAF50; font-weight: bold');
          console.log(`Status: ${event.status} | Time: ${elapsedTime}ms`);
          console.log('Request:', req.body);
          console.log('Response:', event.body);
        }
      })
    );
  }

  return next(req);
};
