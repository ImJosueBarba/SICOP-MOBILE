import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ReportesService } from '../../../services/reportes.service';
import { ConsumoQuimicoDiario } from '../../../models/reportes.model';
import { addIcons } from 'ionicons';
import { downloadOutline, searchOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-consumo-diario',
  templateUrl: './consumo-diario.page.html',
  styleUrls: ['./consumo-diario.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol]
})
export class ConsumoDiarioPage implements OnInit {
  datos: ConsumoQuimicoDiario[] = [];
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
    this.reportesService.getConsumoQuimicoDiario(this.fechaInicio, this.fechaFin).subscribe({
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
      'Químico': d.quimico_nombre,
      'Bodega Ingresa': d.bodega_ingresa,
      'Bodega Egresa': d.bodega_egresa,
      'Bodega Stock': d.bodega_stock,
      'Tanque1 Hora': d.tanque1_hora,
      'Tanque1 L.Inicial': d.tanque1_lectura_inicial,
      'Tanque1 L.Final': d.tanque1_lectura_final,
      'Tanque1 Consumo': d.tanque1_consumo,
      'Tanque2 Hora': d.tanque2_hora,
      'Tanque2 L.Inicial': d.tanque2_lectura_inicial,
      'Tanque2 L.Final': d.tanque2_lectura_final,
      'Tanque2 Consumo': d.tanque2_consumo,
      'Total Consumo': d.total_consumo,
      'Observaciones': d.observaciones
    }));

    const ws = XLSX.utils.json_to_sheet(datosExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consumo Diario');
    XLSX.writeFile(wb, `consumo_diario_${this.fechaInicio}_${this.fechaFin}.xlsx`);
  }
}
