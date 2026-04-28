/**
 * Modelos de autenticación
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
}

export interface User {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  rol: UserRole;
  rol_id: number;
  activo: boolean;
  fecha_contratacion?: string;
  foto_perfil?: string;
  es_administrador: boolean;
  es_operador: boolean;
}

export interface UserRole {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Token {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface TokenPayload {
  sub: string;
  exp: number;
  rol_id: number;
  user_id: number;
}
