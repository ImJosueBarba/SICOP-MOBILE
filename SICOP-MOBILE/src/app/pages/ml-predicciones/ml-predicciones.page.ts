import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButtons, IonMenuButton, IonButton,
  IonIcon, IonSegment, IonSegmentButton, IonLabel, IonItem, IonInput,
  IonGrid, IonRow, IonCol, IonSpinner, IonBadge, IonList, IonNote,
  IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChartOutline, warningOutline, flashOutline, informationCircleOutline, refreshOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { MlService } from '../../features/ml/services/ml.service';
import { PredictionResponse, ModelInfo, Anomaly } from '../../features/ml/models/ml.model';

@Component({
  selector: 'app-ml-predicciones',
  templateUrl: './ml-predicciones.page.html',
  styleUrls: ['./ml-predicciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonBadge,
    IonList,
    IonNote,
    IonRefresher,
    IonRefresherContent
  ]
})
export class MlPrediccionesPage implements OnInit {
  // Tab actual
  selectedSegment: 'prediccion' | 'anomalias' | 'modelo' = 'prediccion';

  // Estado de carga
  loading = false;
  loadingAnomalies = false;
  loadingModel = false;

  // Datos del formulario de predicción
  formData = {
    turbedad_ac: 15.5,        // Turbidez agua cruda (mayor)
    turbedad_at: 0.3,         // Turbidez agua tratada (menor)
    ph_ac: 7.2,               // pH agua cruda
    ph_at: 7.5,               // pH agua tratada
    temperatura_ac: 18.5,     // Temperatura agua cruda
    caudal_total: 3500,       // Caudal total (m³/día, opcional)
    dosis_sulfato: 42,        // Dosis sulfato (kg/día, opcional)
    dosis_cal: 12,            // Dosis cal (kg/día, opcional)
    cloro_residual: 0.9       // Cloro residual (mg/L, opcional)
  };

  // Resultado de predicción
  prediction: PredictionResponse | null = null;
  predictionError: string | null = null;

  // Anomalías
  anomalies: Anomaly[] = [];
  anomaliesError: string | null = null;
  anomalyDays = 7;

  // Información del modelo
  modelInfo: ModelInfo | null = null;
  modelError: string | null = null;

  constructor(private mlService: MlService) {
    addIcons({refreshOutline,statsChartOutline,warningOutline,informationCircleOutline,flashOutline,checkmarkCircleOutline});
  }

  ngOnInit() {
    this.loadModelInfo();
    this.loadAnomalies();
  }

  /**
   * Cambia el tab activo
   */
  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    
    // Cargar datos si no están cargados
    if (this.selectedSegment === 'anomalias' && this.anomalies.length === 0) {
      this.loadAnomalies();
    } else if (this.selectedSegment === 'modelo' && !this.modelInfo) {
      this.loadModelInfo();
    }
  }

  /**
   * Realiza una predicción
   */
  predict() {
    this.loading = true;
    this.predictionError = null;

    this.mlService.predict(this.formData).subscribe({
      next: (response) => {
        this.prediction = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en predicción:', error);
        this.predictionError = error.error?.detail || 'Error al realizar la predicción. Verifica que el modelo esté entrenado.';
        this.loading = false;
      }
    });
  }

  /**
   * Carga anomalías detectadas
   */
  loadAnomalies() {
    this.loadingAnomalies = true;
    this.anomaliesError = null;

    this.mlService.getAnomalies({ days: this.anomalyDays }).subscribe({
      next: (response) => {
        this.anomalies = response.anomalies.filter(a => a.is_anomaly);
        this.loadingAnomalies = false;
      },
      error: (error) => {
        console.error('Error cargando anomalías:', error);
        this.anomaliesError = 'Error al cargar anomalías';
        this.loadingAnomalies = false;
      }
    });
  }

  /**
   * Carga información del modelo
   */
  loadModelInfo() {
    this.loadingModel = true;
    this.modelError = null;

    this.mlService.getModelInfo().subscribe({
      next: (info) => {
        this.modelInfo = info;
        this.loadingModel = false;
      },
      error: (error) => {
        console.error('Error cargando info del modelo:', error);
        this.modelError = error.error?.detail || 'No hay modelo entrenado. Ejecuta: python train_ml_model.py';
        this.loadingModel = false;
      }
    });
  }

  /**
   * Recarga datos cuando se hace pull-to-refresh
   */
  handleRefresh(event: any) {
    Promise.all([
      this.mlService.getModelInfo().toPromise(),
      this.mlService.getAnomalies({ days: this.anomalyDays }).toPromise()
    ]).then(([modelInfo, anomalies]) => {
      if (modelInfo) this.modelInfo = modelInfo;
      if (anomalies) this.anomalies = anomalies.anomalies.filter(a => a.is_anomaly);
      event.target.complete();
    }).catch(error => {
      console.error('Error refreshing:', error);
      event.target.complete();
    });
  }

  /**
   * Obtiene color para badge de severidad
   */
  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critico':
        return 'danger';
      case 'sospechoso':
        return 'warning';
      default:
        return 'success';
    }
  }

  /**
   * Obtiene icono para parámetro
   */
  getParameterIcon(param: string): string {
    if (param.includes('turbedad')) return 'water-outline';
    if (param.includes('ph')) return 'flask-outline';
    if (param.includes('cloro')) return 'fitness-outline';
    return 'alert-circle-outline';
  }

  /**
   * Resetea el formulario a valores por defecto
   */
  resetForm() {
    this.formData = {
      turbedad_ac: 15.5,
      turbedad_at: 0.3,
      ph_ac: 7.2,
      ph_at: 7.5,
      temperatura_ac: 18.5,
      caudal_total: 3500,
      dosis_sulfato: 42,
      dosis_cal: 12,
      cloro_residual: 0.9
    };
    this.prediction = null;
    this.predictionError = null;
  }
}
