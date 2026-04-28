import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ReportesService } from '../../../services/reportes.service';
import { ControlOperacion } from '../../../models/reportes.model';
import { addIcons } from 'ionicons';
import { downloadOutline, searchOutline, refreshOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-control-operacion',
  templateUrl: './control-operacion.page.html',
  styleUrls: ['./control-operacion.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol]
})
export class ControlOperacionPage implements OnInit {
  datos: ControlOperacion[] = [];
  loading = true;
  error = '';
  
  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private reportesService: ReportesService) {
    addIcons({ downloadOutline, searchOutline, refreshOutline });
  }

  ngOnInit() {
    // Establecer fecha de hace 30 días y hoy
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    this.fechaFin = this.formatDate(hoy);
    this.fechaInicio = this.formatDate(hace30Dias);
    
    this.cargarDatos();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  cargarDatos() {
    this.loading = true;
    this.error = '';

    const filtros: any = {};
    if (this.fechaInicio) filtros.fecha_inicio = this.fechaInicio;
    if (this.fechaFin) filtros.fecha_fin = this.fechaFin;

    this.reportesService.getControlOperacion(filtros).subscribe({
      next: (data) => {
        this.datos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.error = 'Error al cargar los datos. Verifica la conexión con el backend.';
        this.loading = false;
      }
    });
  }

  exportarExcel() {
    if (this.datos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Preparar datos para Excel
    const datosExcel = this.datos.map(registro => ({
      'Fecha': registro.fecha,
      'Hora': registro.hora,
      'Turbedad AC': registro.turbedad_ac,
      'Turbedad AT': registro.turbedad_at,
      'Color': registro.color,
      'pH AC': registro.ph_ac,
      'pH Sulf': registro.ph_sulf,
      'pH AT': registro.ph_at,
      'Dosis Sulfato': registro.dosis_sulfato,
      'Dosis Cal': registro.dosis_cal,
      'Dosis Floergel': registro.dosis_floergel,
      'FF': registro.ff,
      'Clarif. IS': registro.clarificacion_is,
      'Clarif. CS': registro.clarificacion_cs,
      'Clarif. FS': registro.clarificacion_fs,
      'Presión PSI': registro.presion_psi,
      'Presión Pre': registro.presion_pre,
      'Presión Pos': registro.presion_pos,
      'Cloro Residual': registro.cloro_residual,
      'Observaciones': registro.observaciones
    }));

    // Crear libro de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Control Operación');

    // Descargar archivo
    const fileName = `control_operacion_${this.fechaInicio}_${this.fechaFin}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  buscar() {
    this.cargarDatos();
  }
}

