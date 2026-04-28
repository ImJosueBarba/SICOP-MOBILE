import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ReportesService } from '../../../services/reportes.service';
import { MonitoreoFisicoquimico } from '../../../models/reportes.model';
import { addIcons } from 'ionicons';
import { downloadOutline, searchOutline, refreshOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-monitoreo-fisicoquimico',
  templateUrl: './monitoreo-fisicoquimico.page.html',
  styleUrls: ['./monitoreo-fisicoquimico.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol]
})
export class MonitoreoFisicoquimicoPage implements OnInit {
  datos: MonitoreoFisicoquimico[] = [];
  cargando = false;
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private reportesService: ReportesService) {
    addIcons({ downloadOutline, searchOutline, refreshOutline });
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
    this.reportesService.getMonitoreoFisicoquimico(this.fechaInicio, this.fechaFin).subscribe({
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
      'Muestra #': d.muestra_numero,
      'Hora': d.hora,
      'PH AC': d.ac_ph,
      'PH AT': d.at_ph,
      'CE AC': d.ac_ce,
      'CE AT': d.at_ce,
      'TDS AC': d.ac_tds,
      'TDS AT': d.at_tds,
      'Salinidad AC': d.ac_salinidad,
      'Salinidad AT': d.at_salinidad,
      'Temperatura AC': d.ac_temperatura,
      'Temperatura AT': d.at_temperatura,
      'Observaciones': d.observaciones
    }));

    const ws = XLSX.utils.json_to_sheet(datosExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monitoreo Fisicoquímico');
    XLSX.writeFile(wb, `monitoreo_fisicoquimico_${this.fechaInicio}_${this.fechaFin}.xlsx`);
  }
}
