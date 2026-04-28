import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonButtons, IonMenuButton, IonButton,
  IonIcon, IonGrid, IonRow, IonCol, IonBadge, IonSpinner, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  statsChartOutline, warningOutline, checkmarkCircleOutline, 
  arrowForwardOutline, beakerOutline, analyticsOutline, 
  alertCircleOutline, shieldCheckmarkOutline, helpCircleOutline, 
  waterOutline, flaskOutline, speedometerOutline, documentTextOutline, 
  refreshOutline, timeOutline, alertCircle, water, flask,
  trendingUpOutline, trendingDownOutline, removeOutline, syncOutline,
  moonOutline, sunnyOutline } from 'ionicons/icons';
import { TimeFilterComponent } from '../../shared/components/time-filter/time-filter.component';
import { DashboardKPIService } from '../../services/dashboard-kpi.service';
import { ThresholdService } from '../../services/threshold.service';
import { HelpService } from '../../services/help.service';
import { ThemeService } from '../../services/theme.service';
import {
  KPIDashboard,
  KPIStatus,
  TrendDirection,
  TimeFilter,
  TimeFilterPreset
} from '../../models/dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
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
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    IonSpinner,
    TimeFilterComponent
  ]
})
export class DashboardPage implements OnInit, OnDestroy {
  dashboard: KPIDashboard | null = null;
  loading = true;
  selectedFilter: TimeFilterPreset = '24h';
  currentFilter: TimeFilter | null = null;
  alertCounts = { total: 0, critical: 0, warning: 0 };
  lastUpdate: Date | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private dashboardKPIService: DashboardKPIService,
    private thresholdService: ThresholdService,
    private helpService: HelpService,
    private alertController: AlertController,
    public themeService: ThemeService
  ) {
    addIcons({helpCircleOutline,syncOutline,alertCircle,waterOutline,water,flaskOutline,flask,beakerOutline,speedometerOutline,statsChartOutline,documentTextOutline,refreshOutline,timeOutline,trendingUpOutline,trendingDownOutline,removeOutline,warningOutline,checkmarkCircleOutline,arrowForwardOutline,analyticsOutline,alertCircleOutline,shieldCheckmarkOutline,moonOutline,sunnyOutline});
  }

  ngOnInit() {
    // Inicializar con filtro por defecto (24h)
    this.initializeFilter();

    // Suscribirse a alertas
    this.subscriptions.push(
      this.thresholdService.getAlerts().subscribe(alerts => {
        this.alertCounts = this.thresholdService.getAlertCounts();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Inicializa el filtro por defecto
   */
  private initializeFilter() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.currentFilter = {
      preset: '24h',
      label: 'Últimas 24h',
      start: yesterday,
      end: now,
      refreshInterval: 60000
    };

    this.loadDashboard();
  }

  /**
   * Maneja cambio de filtro de tiempo
   */
  onFilterChange(filter: TimeFilter) {
    this.currentFilter = filter;
    this.selectedFilter = filter.preset;
    this.loadDashboard();
  }

  /**
   * Carga datos del dashboard con actualización automática cada 60s
   */
  private loadDashboard() {
    if (!this.currentFilter) return;

    this.loading = true;

    // Usar subscribeToRealTimeKPIs para auto-refresh cada 60 segundos
    this.subscriptions.push(
      this.dashboardKPIService.subscribeToRealTimeKPIs(this.currentFilter).subscribe({
        next: (dashboard) => {
          this.dashboard = dashboard;
          this.loading = false;
          this.lastUpdate = new Date();

          // Evaluar alertas de umbral
          const alerts = this.thresholdService.evaluateDashboard(dashboard);
          console.log(`📊 Dashboard cargado: ${dashboard.dataPoints} registros`);
          console.log(`⚠️ Alertas generadas: ${alerts.length}`);
          console.log(`🔄 Próxima actualización en 60 segundos...`);
        },
        error: (error) => {
          console.error('Error cargando dashboard:', error);
          this.loading = false;
        }
      })
    );
  }

  /**
   * Refresca datos manualmente
   */
  refreshData() {
    this.loadDashboard();
  }

  /**
   * Obtiene color según estado del KPI
   */
  getStatusColor(status: KPIStatus): string {
    const colors: Record<KPIStatus, string> = {
      normal: 'success',
      warning: 'warning',
      critical: 'danger',
      unknown: 'medium'
    };
    return colors[status];
  }

  /**
   * Obtiene etiqueta según estado del KPI
   */
  getStatusLabel(status: KPIStatus): string {
    const labels: Record<KPIStatus, string> = {
      normal: 'Normal',
      warning: 'Advertencia',
      critical: 'Crítico',
      unknown: 'Sin datos'
    };
    return labels[status];
  }

  /**
   * Obtiene ícono según tendencia
   */
  getTrendIcon(trend: TrendDirection): string {
    const icons: Record<TrendDirection, string> = {
      up: 'trending-up-outline',
      down: 'trending-down-outline',
      stable: 'remove-outline'
    };
    return icons[trend];
  }

  /**
   * Muestra alertas activas
   */
  async viewAlerts() {
    const alerts = this.thresholdService.getAlertHistory()
      .filter(a => !a.acknowledged)
      .slice(0, 10); // Últimas 10

    if (alerts.length === 0) {
      const alert = await this.alertController.create({
        header: 'Sin Alertas',
        message: 'No hay alertas activas en este momento.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alertMessages = alerts.map((a, i) => 
      `${i + 1}. ${a.message} (${new Date(a.timestamp).toLocaleTimeString()})`
    ).join('\n\n');

    const alert = await this.alertController.create({
      header: `${alerts.length} Alertas Activas`,
      message: alertMessages,
      buttons: [
        {
          text: 'Reconocer Todas',
          handler: () => {
            this.thresholdService.acknowledgeAll();
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  /**
   * Abre modal de ayuda
   */
  openHelp() {
    this.helpService.openHelpModal('dashboard');
  }
}

