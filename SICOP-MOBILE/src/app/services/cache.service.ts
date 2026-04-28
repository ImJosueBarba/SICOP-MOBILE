import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Cache Service - Sistema de Modo Offline
 * Permite almacenar y recuperar datos del dashboard localmente
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_KEY_PREFIX = 'sicop_cache_';
  private readonly CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas
  
  private offlineMode$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Detectar estado de conectividad
    this.updateConnectivityStatus();
    window.addEventListener('online', () => this.updateConnectivityStatus());
    window.addEventListener('offline', () => this.updateConnectivityStatus());
  }

  /**
   * Observable del estado offline
   */
  isOffline(): Observable<boolean> {
    return this.offlineMode$.asObservable();
  }

  /**
   * Guarda datos en caché con timestamp
   */
  set<T>(key: string, data: T): void {
    const cacheEntry = {
      data,
      timestamp: new Date().getTime()
    };

    try {
      localStorage.setItem(
        `${this.CACHE_KEY_PREFIX}${key}`,
        JSON.stringify(cacheEntry)
      );
      console.log(`💾 Datos guardados en caché: ${key}`);
    } catch (error) {
      console.error('Error guardando en caché:', error);
    }
  }

  /**
   * Recupera datos del caché si no han expirado
   */
  get<T>(key: string): T | null {
    try {
      const cachedData = localStorage.getItem(`${this.CACHE_KEY_PREFIX}${key}`);
      
      if (!cachedData) {
        return null;
      }

      const cacheEntry = JSON.parse(cachedData);
      const now = new Date().getTime();
      const age = now - cacheEntry.timestamp;

      // Verificar si ha expirado
      if (age > this.CACHE_EXPIRY_MS) {
        console.log(`⏰ Caché expirado: ${key}`);
        this.remove(key);
        return null;
      }

      console.log(`📤 Datos recuperados del caché: ${key} (edad: ${Math.round(age / 1000 / 60)}min)`);
      return cacheEntry.data as T;
    } catch (error) {
      console.error('Error leyendo caché:', error);
      return null;
    }
  }

  /**
   * Elimina datos del caché
   */
  remove(key: string): void {
    localStorage.removeItem(`${this.CACHE_KEY_PREFIX}${key}`);
    console.log(`🗑️ Caché eliminado: ${key}`);
  }

  /**
   * Limpia todo el caché de la aplicación
   */
  clearAll(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('🧹 Caché completo limpiado');
  }

  /**
   * Obtiene el tamaño total del caché (aproximado en KB)
   */
  getCacheSize(): number {
    let totalSize = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_KEY_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }
    });

    return Math.round(totalSize / 1024); // KB
  }

  /**
   * Verifica si una clave existe en caché
   */
  has(key: string): boolean {
    return localStorage.getItem(`${this.CACHE_KEY_PREFIX}${key}`) !== null;
  }

  /**
   * Obtiene la fecha del último dato en caché
   */
  getLastCacheDate(key: string): Date | null {
    try {
      const cachedData = localStorage.getItem(`${this.CACHE_KEY_PREFIX}${key}`);
      if (!cachedData) return null;

      const cacheEntry = JSON.parse(cachedData);
      return new Date(cacheEntry.timestamp);
    } catch {
      return null;
    }
  }

  /**
   * Actualiza el estado de conectividad
   */
  private updateConnectivityStatus(): void {
    const isOffline = !navigator.onLine;
    this.offlineMode$.next(isOffline);
    
    if (isOffline) {
      console.log('📵 Modo OFFLINE activado');
    } else {
      console.log('📶 Conectividad restaurada');
    }
  }

  /**
   * Obtiene todas las claves de caché
   */
  getAllKeys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.CACHE_KEY_PREFIX))
      .map(key => key.replace(this.CACHE_KEY_PREFIX, ''));
  }

  /**
   * Limpia entradas expiradas del caché
   */
  cleanExpired(): void {
    const keys = this.getAllKeys();
    let cleanedCount = 0;

    keys.forEach(key => {
      const data = this.get(key);
      if (data === null) {
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`🧹 ${cleanedCount} entradas expiradas eliminadas`);
    }
  }
}
