import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ReportesService } from '../../../services/reportes.service';
import { ControlCloroLibre } from '../../../models/reportes.model';
import { addIcons } from 'ionicons';
import { downloadOutline, searchOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-control-cloro',
  templateUrl: './control-cloro.page.html',
  styleUrls: ['./control-cloro.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol]
})
export class ControlCloroPage implements OnInit {
  datos: ControlCloroLibre[] = [];
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
    this.reportesService.getControlCloroLibre(this.fechaInicio, this.fechaFin).subscribe({
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
      'Fecha Mes': d.fecha_mes,
      'Documento': d.documento_soporte,
      'Proveedor/Solicitante': d.proveedor_solicitante,
      'Código': d.codigo,
      'Especificación': d.especificacion,
      'Entra': d.cantidad_entra,
      'Sale': d.cantidad_sale,
      'Saldo': d.cantidad_saldo,
      'Observaciones': d.observaciones
    }));

    const ws = XLSX.utils.json_to_sheet(datosExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Control Cloro');
    XLSX.writeFile(wb, `control_cloro_${this.fechaInicio}_${this.fechaFin}.xlsx`);
  }
}
