import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

/**
 * Servicio para mostrar notificaciones Toast
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  constructor(private toastController: ToastController) {}

  /**
   * Muestra un toast de éxito
   */
  async success(message: string, duration: number = 3000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'success',
      position: 'top',
      icon: 'checkmark-circle-outline',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Muestra un toast de error
   */
  async error(message: string, duration: number = 4000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'danger',
      position: 'top',
      icon: 'alert-circle-outline',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Muestra un toast de advertencia
   */
  async warning(message: string, duration: number = 3500): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'warning',
      position: 'top',
      icon: 'warning-outline',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Muestra un toast informativo
   */
  async info(message: string, duration: number = 3000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'primary',
      position: 'top',
      icon: 'information-circle-outline',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Muestra un toast con configuración personalizada
   */
  async show(options: {
    message: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'dark';
    duration?: number;
    position?: 'top' | 'bottom' | 'middle';
    icon?: string;
  }): Promise<void> {
    const toast = await this.toastController.create({
      message: options.message,
      duration: options.duration || 3000,
      color: options.color || 'dark',
      position: options.position || 'top',
      icon: options.icon,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Cierra todos los toasts activos
   */
  async dismissAll(): Promise<void> {
    const toast = await this.toastController.getTop();
    if (toast) {
      await this.toastController.dismiss();
    }
  }
}
