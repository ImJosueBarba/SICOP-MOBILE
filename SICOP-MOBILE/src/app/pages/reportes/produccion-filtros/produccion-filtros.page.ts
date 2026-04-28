import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ReportesService } from '../../../services/reportes.service';
import { ProduccionFiltro } from '../../../models/reportes.model';
import { addIcons } from 'ionicons';
import { downloadOutline, searchOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-produccion-filtros',
  templateUrl: './produccion-filtros.page.html',
  styleUrls: ['./produccion-filtros.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol]
})
export class ProduccionFiltrosPage implements OnInit {
  datos: ProduccionFiltro[] = [];
  cargando = false;
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private reportesService: ReportesService) {
    addIcons({ downloadOutline, searchOutline });
  }

  ngOnInit() {
    const hoy = new Date();
    const hace30dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
    this.fechaInicio = hace30dias.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.reportesService.getProduccionFiltros(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.datos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.cargando = false;
      }
    });
  }

  buscar() {
    this.cargarDatos();
  }

  exportarExcel() {
    const datosExportar = this.datos.map(d => ({
      'Fecha': d.fecha,
      'Hora': d.hora,
      'Filtro 1 H': d.filtro1_h,
      'Filtro 1 Q': d.filtro1_q,
      'Filtro 2 H': d.filtro2_h,
      'Filtro 2 Q': d.filtro2_q,
      'Filtro 3 H': d.filtro3_h,
      'Filtro 3 Q': d.filtro3_q,
      'Filtro 4 H': d.filtro4_h,
      'Filtro 4 Q': d.filtro4_q,
      'Filtro 5 H': d.filtro5_h,
      'Filtro 5 Q': d.filtro5_q,
      'Filtro 6 H': d.filtro6_h,
      'Filtro 6 Q': d.filtro6_q,
      'Caudal Total': d.caudal_total,
      'Observaciones': d.observaciones
    }));

    const ws = XLSX.utils.json_to_sheet(datosExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Producción Filtros');
    XLSX.writeFile(wb, `produccion_filtros_${this.fechaInicio}_${this.fechaFin}.xlsx`);
  }
}
