import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { StorageService } from '../../../core/services/storage.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import { User, AuthResponse, LoginRequest } from '../../../core/models/auth.model';

/**
 * Servicio de autenticación refactorizado con Clean Architecture
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private errorHandler: ErrorHandlerService
  ) {
    this.initializeAuth();
  }

  /**
   * Inicializa el estado de autenticación desde el storage
   */
  private async initializeAuth(): Promise<void> {
    const token = this.storageService.getAuthToken();
    const userData = this.storageService.getUserData<User>();

    if (token && userData) {
      this.currentUserSubject.next(userData);
      this.isAuthenticatedSubject.next(true);
      
      // Opcional: validar token con el backend
      // await this.validateToken().catch(() => this.logout());
    }
  }

  /**
   * Realiza login con credenciales
   */
  login(credentials: LoginRequest): Observable<User> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    return this.apiService.postForm<AuthResponse>(API_CONSTANTS.AUTH.LOGIN, formData, {
      loadingMessage: 'Iniciando sesión...'
    }).pipe(
      tap(response => {
        // Guardar token
        this.storageService.setAuthToken(response.access_token);
      }),
      // Cargar datos del usuario      
      map(response => this.loadUserProfile()),
      catchError(error => {
        this.errorHandler.handleHttpError(error);
        return throwError(() => error);
      })
    ) as any;
  }

  /**
   * Carga el perfil del usuario autenticado
   */
  private loadUserProfile(): Observable<User> {
    return this.apiService.get<User>(API_CONSTANTS.AUTH.ME, undefined, {
      showLoading: false
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.storageService.setUserData(user);
        this.isAuthenticatedSubject.next(true);
        this.errorHandler.showSuccess('¡Bienvenido de nuevo!');
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    // Limpiar storage
    this.storageService.clearAuthData();
    
    // Limpiar estado
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    this.errorHandler.showInfo('Sesión cerrada exitosamente');
  }

  /**
   * Obtiene el usuario actual de forma síncrona
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado (método síncrono)
   */
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value && !!this.storageService.getAuthToken();
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.storageService.getAuthToken();
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol?.nombre === roleName || false;
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.es_administrador || false;
  }

  /**
   * Verifica si el usuario es operador
   */
  isOperator(): boolean {
    const user = this.getCurrentUser();
    return user?.es_operador || false;
  }

  /**
   * Recarga los datos del usuario desde el backend
   */
  reloadUserProfile(): Observable<User> {
    return this.apiService.get<User>(API_CONSTANTS.AUTH.ME, undefined, {
      showLoading: false
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.storageService.setUserData(user);
      })
    );
  }

  /**
   * Valida si el token actual es válido
   */
  private validateToken(): Observable<boolean> {
    return this.apiService.get<User>(API_CONSTANTS.AUTH.ME, undefined, {
      showLoading: false,
      silentError: true
    }).pipe(
      map(() => true),
      catchError(() => {
        this.logout();
        return throwError(() => new Error('Token inválido'));
      })
    );
  }
}
