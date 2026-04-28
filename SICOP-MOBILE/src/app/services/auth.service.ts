import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id?: number;
  username: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  rol: any;
  rol_id: number;
  activo: boolean;
  fecha_contratacion?: string;
  foto_perfil?: string;
  sub: string;
  es_administrador?: boolean;
  es_operador?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<void> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/token`, formData)
      );

      localStorage.setItem(this.tokenKey, response.access_token);

      // Load user data
      const user = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/me`, {
          headers: { 'Authorization': `Bearer ${response.access_token}` }
        })
      );

      this.currentUserSubject.next({
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        rol_id: user.rol_id,
        activo: user.activo,
        fecha_contratacion: user.fecha_contratacion,
        foto_perfil: user.foto_perfil,
        sub: user.username,
        es_administrador: user.es_administrador,
        es_operador: user.es_operador
      });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Backend no responde o credenciales incorrectas');
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUserSubject.asObservable().pipe(
      tap(user => !!user)
    ) as any;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  async loadUserFromToken(): Promise<void> {
    const token = this.getToken();
    if (!token) {
      this.currentUserSubject.next(null);
      return;
    }

    try {
      const user = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );

      this.currentUserSubject.next({
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        rol_id: user.rol_id,
        activo: user.activo,
        fecha_contratacion: user.fecha_contratacion,
        foto_perfil: user.foto_perfil,
        sub: user.username,
        es_administrador: user.es_administrador,
        es_operador: user.es_operador
      });
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem(this.tokenKey);
      this.currentUserSubject.next(null);
    }
  }
}
