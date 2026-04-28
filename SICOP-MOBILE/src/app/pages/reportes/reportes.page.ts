import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonMenuButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, waterOutline, flaskOutline, filterOutline, statsChartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonMenuButton, IonIcon]
})
export class ReportesPage implements OnInit {
  reportes = [
    { id: 1, nombre: 'Control de Operación', ruta: '/reportes/control-operacion', icon: 'stats-chart-outline', color: 'primary' },
    { id: 2, nombre: 'Registro de Reactivos', ruta: '/reportes/registro-reactivos', icon: 'flask-outline', color: 'secondary' },
    { id: 3, nombre: 'Monitoreo Fisicoquímico', ruta: '/reportes/monitoreo-fisicoquimico', icon: 'water-outline', color: 'tertiary' },
    { id: 4, nombre: 'Producción de Filtros', ruta: '/reportes/produccion-filtros', icon: 'filter-outline', color: 'success' },
    { id: 5, nombre: 'Consumo Diario', ruta: '/reportes/consumo-diario', icon: 'document-text-outline', color: 'warning' },
    { id: 6, nombre: 'Consumo Mensual', ruta: '/reportes/consumo-mensual', icon: 'document-text-outline', color: 'danger' }
  ];

  constructor(private router: Router) {
    addIcons({ documentTextOutline, waterOutline, flaskOutline, filterOutline, statsChartOutline });
  }

  ngOnInit() {}

  abrirReporte(reporte: any) {
    this.router.navigate([reporte.ruta]);
  }
}
