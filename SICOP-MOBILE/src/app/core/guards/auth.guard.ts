import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  const token = storageService.getAuthToken();

  if (token) {
    // TODO: Validar que el token no esté expirado
    return true;
  }

  // Guardar la URL a la que intentaba acceder para redirigir después del login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * Guard para rutas públicas (login, register)
 * Redirige al dashboard si el usuario ya está autenticado
 */
export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  const token = storageService.getAuthToken();

  if (!token) {
    return true;
  }

  // Usuario ya autenticado, redirigir al dashboard
  return router.createUrlTree(['/dashboard']);
};

/**
 * Guard para verificar roles específicos
 */
export const roleGuard: (allowedRoles: string[]) => CanActivateFn = (allowedRoles: string[]) => {
  return (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree => {
    const router = inject(Router);
    const storageService = inject(StorageService);

    const userData = storageService.getUserData<any>();

    if (!userData) {
      return router.createUrlTree(['/login']);
    }

    const userRole = userData.rol?.nombre || '';

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // Usuario no tiene permisos, redirigir al dashboard
    console.warn('Acceso denegado: rol no autorizado');
    return router.createUrlTree(['/dashboard']);
  };
};
