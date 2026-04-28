import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  searchOutline,
  barChartOutline,
  alertCircleOutline,
  documentTextOutline,
  statsChartOutline,
  helpCircleOutline, arrowBack } from 'ionicons/icons';
import { HelpService } from '../../../services/help.service';
import { HelpTopic, HelpCategory } from '../../../models/help.model';

/**
 * Help Modal Component - Modal de Ayuda In-App
 * Sistema de documentación integrado con búsqueda y categorías
 */
@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class HelpModalComponent implements OnInit {
  @Input() initialCategory?: HelpCategory;
  @Input() initialTopicId?: string;

  selectedCategory: HelpCategory | 'all' = 'all';
  searchQuery = '';
  topics: HelpTopic[] = [];
  selectedTopic: HelpTopic | null = null;

  categories: HelpCategory[] = [];

  constructor(
    private modalController: ModalController,
    private helpService: HelpService
  ) {
    addIcons({closeOutline,searchOutline,arrowBack,barChartOutline,alertCircleOutline,documentTextOutline,statsChartOutline,helpCircleOutline});
  }

  ngOnInit() {
    this.categories = this.helpService.getCategories();
    
    // Cargar categoría o tema inicial si se especificó
    if (this.initialTopicId) {
      const topic = this.helpService.getTopic(this.initialTopicId);
      if (topic) {
        this.selectedTopic = topic;
        this.selectedCategory = topic.category;
      }
    } else if (this.initialCategory) {
      this.selectedCategory = this.initialCategory;
    }

    this.loadTopics();
  }

  /**
   * Cierra el modal
   */
  dismiss() {
    this.modalController.dismiss();
  }

  /**
   * Carga temas según filtros
   */
  loadTopics() {
    if (this.searchQuery.trim().length > 0) {
      this.topics = this.helpService.searchTopics(this.searchQuery);
      return;
    }

    if (this.selectedCategory === 'all') {
      this.topics = this.helpService.getAllTopics();
    } else {
      this.topics = this.helpService.getTopicsByCategory(this.selectedCategory);
    }

    // Si hay un tema seleccionado que ya no está en los resultados, limpiarlo
    if (this.selectedTopic && !this.topics.find(t => t.id === this.selectedTopic!.id)) {
      this.selectedTopic = null;
    }
  }

  /**
   * Cambia la categoría seleccionada
   */
  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.selectedTopic = null;
    this.searchQuery = '';
    this.loadTopics();
  }

  /**
   * Maneja cambios en la búsqueda
   */
  onSearchChange(event: any) {
    this.searchQuery = event.detail.value || '';
    this.selectedTopic = null;
    this.loadTopics();
  }

  /**
   * Selecciona un tema para mostrar
   */
  selectTopic(topic: HelpTopic) {
    this.selectedTopic = topic;
  }

  /**
   * Vuelve a la lista de temas
   */
  backToList() {
    this.selectedTopic = null;
  }

  /**
   * Obtiene ícono de categoría
   */
  getCategoryIcon(category: HelpCategory): string {
    return this.helpService.getCategoryIcon(category);
  }

  /**
   * Obtiene nombre de categoría
   */
  getCategoryName(category: HelpCategory): string {
    return this.helpService.getCategoryName(category);
  }
}
