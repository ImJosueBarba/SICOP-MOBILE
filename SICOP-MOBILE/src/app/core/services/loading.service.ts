import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';

/**
 * Servicio para gestionar loadings/spinners
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStack: HTMLIonLoadingElement[] = [];
  private isLoading = false;

  constructor(private loadingController: LoadingController) {}

  /**
   * Muestra un loading con mensaje personalizado
   */
  async show(message: string = 'Cargando...'): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
      translucent: true,
      cssClass: 'custom-loading'
    });

    this.loadingStack.push(loading);
    await loading.present();
  }

  /**
   * Oculta el loading actual
   */
  async hide(): Promise<void> {
    if (this.loadingStack.length > 0) {
      const loading = this.loadingStack.pop();
      if (loading) {
        await loading.dismiss();
      }
    }

    if (this.loadingStack.length === 0) {
      this.isLoading = false;
    }
  }

  /**
   * Oculta todos los loadings activos
   */
  async hideAll(): Promise<void> {
    while (this.loadingStack.length > 0) {
      await this.hide();
    }
    this.isLoading = false;
  }

  /**
   * Ejecuta una operación con loading automático
   */
  async withLoading<T>(
    operation: () => Promise<T>,
    message: string = 'Procesando...'
  ): Promise<T> {
    try {
      await this.show(message);
      const result = await operation();
      await this.hide();
      return result;
    } catch (error) {
      await this.hide();
      throw error;
    }
  }

  /**
   * Verifica si hay un loading activo
   */
  getIsLoading(): boolean {
    return this.isLoading;
  }
}
