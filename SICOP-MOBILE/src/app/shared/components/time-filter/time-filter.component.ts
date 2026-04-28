import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonChip, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, calendarOutline, checkmarkCircle } from 'ionicons/icons';
import { TimeFilter, TimeFilterPreset, TIME_FILTER_PRESETS } from '../../../models/dashboard.model';

/**
 * Time Filter Component - Filtros Rápidos de Tiempo
 * Componente reutilizable para filtros de tiempo pre-configurados
 */
@Component({
  selector: 'app-time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonChip, IonIcon, IonLabel]
})
export class TimeFilterComponent {
  @Input() selectedPreset: TimeFilterPreset = '24h';
  @Output() filterChange = new EventEmitter<TimeFilter>();

  filterPresets = TIME_FILTER_PRESETS;

  constructor() {
    addIcons({ timeOutline, calendarOutline, checkmarkCircle });
  }

  /**
   * Selecciona un filtro predefinido
   */
  selectFilter(preset: TimeFilterPreset): void {
    const filter = this.createTimeFilter(preset);
    this.selectedPreset = preset;
    this.filterChange.emit(filter);
  }

  /**
   * Crea configuración de TimeFilter según el preset
   */
  private createTimeFilter(preset: TimeFilterPreset): TimeFilter {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (preset) {
      case '24h':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;

      case 'shift':
        // Turno de 8 horas (6 AM - 2 PM, 2 PM - 10 PM, 10 PM - 6 AM)
        const currentHour = now.getHours();
        if (currentHour >= 6 && currentHour < 14) {
          // Turno mañana: 6:00 - 14:00
          start = new Date(now);
          start.setHours(6, 0, 0, 0);
        } else if (currentHour >= 14 && currentHour < 22) {
          // Turno tarde: 14:00 - 22:00
          start = new Date(now);
          start.setHours(14, 0, 0, 0);
        } else {
          // Turno noche: 22:00 - 6:00
          start = new Date(now);
          if (currentHour >= 22) {
            start.setHours(22, 0, 0, 0);
          } else {
            // Turno nocturno del día anterior
            start.setDate(start.getDate() - 1);
            start.setHours(22, 0, 0, 0);
          }
        }
        break;

      case 'weekly':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;

      case 'custom':
        // Por defecto, últimos 7 días
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;

      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const presetConfig = TIME_FILTER_PRESETS.find(p => p.preset === preset)!;

    return {
      preset,
      label: presetConfig.label,
      start,
      end,
      refreshInterval: presetConfig.refreshInterval
    };
  }

  /**
   * Verifica si un preset está seleccionado
   */
  isSelected(preset: TimeFilterPreset): boolean {
    return this.selectedPreset === preset;
  }
}
