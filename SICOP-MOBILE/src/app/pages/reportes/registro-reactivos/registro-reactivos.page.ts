import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonBadge, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ReportesService } from '../../../services/reportes.service';
import { Reactivo } from '../../../models/reportes.model';
import { addIcons } from 'ionicons';
import { downloadOutline, refreshOutline, warningOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-registro-reactivos',
  templateUrl: './registro-reactivos.page.html',
  styleUrls: ['./registro-reactivos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonBadge, IonGrid, IonRow, IonCol]
})
export class RegistroReactivosPage implements OnInit {
  datos: Reactivo[] = [];
  cargando = false;

  constructor(private reportesService: ReportesService) {
    addIcons({ downloadOutline, refreshOutline, warningOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.reportesService.getReactivos().subscribe({
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
      'ID': d.id,
      'Nombre': d.nombre,
      'Descripción': d.descripcion,
      'Unidad': d.unidad_medida,
      'Stock Actual': d.stock_actual,
      'Stock Mínimo': d.stock_minimo,
      'Precio Unitario': d.precio_unitario,
      'Proveedor': d.proveedor,
      'Fecha Vencimiento': d.fecha_vencimiento,
      'Lote': d.lote,
      'Observaciones': d.observaciones
    }));

    const ws = XLSX.utils.json_to_sheet(datosExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reactivos');
    XLSX.writeFile(wb, `registro_reactivos_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  stockBajo(reactivo: Reactivo): boolean {
    if (reactivo.stock_actual !== undefined && reactivo.stock_minimo !== undefined) {
      return reactivo.stock_actual <= reactivo.stock_minimo;
    }
    return false;
  }
}
