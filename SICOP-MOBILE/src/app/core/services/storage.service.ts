import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/api.constants';

/**
 * Servicio centralizado para manejo de almacenamiento local
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  /**
   * Guarda un valor en localStorage
   */
  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Obtiene un valor de localStorage
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Obtiene un valor de localStorage de forma síncrona sin parsear
   */
  getString(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Elimina un valor de localStorage
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Verifica si existe una clave en localStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Guarda el token de autenticación
   */
  setAuthToken(token: string): void {
    this.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Obtiene el token de autenticación
   */
  getAuthToken(): string | null {
    return this.getString(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Elimina el token de autenticación
   */
  removeAuthToken(): void {
    this.remove(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Guarda datos de usuario
   */
  setUserData(user: any): void {
    this.set(STORAGE_KEYS.USER_DATA, user);
  }

  /**
   * Obtiene datos de usuario
   */
  getUserData<T>(): T | null {
    return this.get<T>(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Elimina datos de usuario
   */
  removeUserData(): void {
    this.remove(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Limpia toda la data de autenticación
   */
  clearAuthData(): void {
    this.removeAuthToken();
    this.removeUserData();
    this.remove(STORAGE_KEYS.REFRESH_TOKEN);
    this.remove(STORAGE_KEYS.REMEMBER_ME);
  }
}
