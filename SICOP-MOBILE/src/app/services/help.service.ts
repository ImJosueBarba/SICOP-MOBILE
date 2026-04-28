import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { HelpModalComponent } from '../shared/components/help-modal/help-modal.component';
import { HelpTopic, HELP_TOPICS, HelpCategory } from '../models/help.model';

/**
 * Help Service - Servicio de Sistema de Ayuda
 * Gestiona temas de ayuda y modal de documentación
 */
@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private allTopics: HelpTopic[] = HELP_TOPICS;

  constructor(private modalController: ModalController) {}

  /**
   * Abre el modal de ayuda
   */
  async openHelpModal(category?: HelpCategory, topicId?: string): Promise<void> {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        initialCategory: category,
        initialTopicId: topicId
      },
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.75,
      cssClass: 'help-modal'
    });

    await modal.present();
  }

  /**
   * Busca temas por palabra clave
   */
  searchTopics(query: string): HelpTopic[] {
    if (!query || query.trim().length === 0) {
      return this.allTopics;
    }

    const lowerQuery = query.toLowerCase();
    
    return this.allTopics.filter(topic => {
      const titleMatch = topic.title.toLowerCase().includes(lowerQuery);
      const contentMatch = topic.content.toLowerCase().includes(lowerQuery);
      const keywordMatch = topic.keywords.some(k => k.toLowerCase().includes(lowerQuery));

      return titleMatch || contentMatch || keywordMatch;
    });
  }

  /**
   * Obtiene temas por categoría
   */
  getTopicsByCategory(category: HelpCategory): HelpTopic[] {
    return this.allTopics
      .filter(topic => topic.category === category)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Obtiene un tema específico
   */
  getTopic(topicId: string): HelpTopic | undefined {
    return this.allTopics.find(t => t.id === topicId);
  }

  /**
   * Obtiene todos los temas
   */
  getAllTopics(): HelpTopic[] {
    return [...this.allTopics].sort((a, b) => a.order - b.order);
  }

  /**
   * Obtiene categorías únicas
   */
  getCategories(): HelpCategory[] {
    return ['dashboard', 'alerts', 'reports', 'ml', 'general'];
  }

  /**
   * Obtiene el ícono de categoría
   */
  getCategoryIcon(category: HelpCategory): string {
    const icons: Record<HelpCategory, string> = {
      dashboard: 'bar-chart-outline',
      alerts: 'alert-circle-outline',
      reports: 'document-text-outline',
      ml: 'stats-chart-outline',
      general: 'help-circle-outline'
    };
    return icons[category];
  }

  /**
   * Obtiene el nombre de categoría en español
   */
  getCategoryName(category: HelpCategory): string {
    const names: Record<HelpCategory, string> = {
      dashboard: 'Dashboard',
      alerts: 'Alertas',
      reports: 'Reportes',
      ml: 'Machine Learning',
      general: 'General'
    };
    return names[category];
  }
}
