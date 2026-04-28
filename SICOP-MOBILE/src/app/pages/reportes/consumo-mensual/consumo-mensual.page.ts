import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ReportesService } from '../../../services/reportes.service';
import { ConsumoQuimicoMensual } from '../../../models/reportes.model';
import { addIcons } from 'ionicons';
import { downloadOutline, searchOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-consumo-mensual',
  templateUrl: './consumo-mensual.page.html',
  styleUrls: ['./consumo-mensual.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonSpinner, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol]
})
export class ConsumoMensualPage implements OnInit {
  datos: ConsumoQuimicoMensual[] = [];
  cargando = false;
  mes: number = 0;
  anio: number = 0;
  meses = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' }
  ];

  constructor(private reportesService: ReportesService) {
    addIcons({ downloadOutline, searchOutline });
  }

  ngOnInit() {
    const fecha = new Date();
    this.mes = fecha.getMonth() + 1;
    this.anio = fecha.getFullYear();
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.reportesService.getConsumoQuimicoMensual(this.mes, this.anio).subscribe({
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
      'Mes': d.mes,
      'Año': d.anio,
      'Sulfato Consumo': d.sulfato_con,
      'Sulfato Ingreso': d.sulfato_ing,
      'Sulfato Guía': d.sulfato_guia,
      'Sulfato Remanente': d.sulfato_re,
      'Cal Consumo': d.cal_con,
      'Cal Ingreso': d.cal_ing,
      'Cal Guía': d.cal_guia,
      'Hipoclorito Consumo': d.hipoclorito_con,
      'Hipoclorito Ingreso': d.hipoclorito_ing,
      'Hipoclorito Guía': d.hipoclorito_guia,
      'Cloro Gas Consumo': d.cloro_gas_con,
      'Cloro Gas Ing.Balón': d.cloro_gas_ing_bal,
      'Cloro Gas Ing.Bodega': d.cloro_gas_ing_bdg,
      'Cloro Gas Guía': d.cloro_gas_guia,
      'Cloro Gas Egreso': d.cloro_gas_egre,
      'Observaciones': d.observaciones
    }));

    const ws = XLSX.utils.json_to_sheet(datosExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consumo Mensual');
    XLSX.writeFile(wb, `consumo_mensual_${this.mes}_${this.anio}.xlsx`);
  }
}
