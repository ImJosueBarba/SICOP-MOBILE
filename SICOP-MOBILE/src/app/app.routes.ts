import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage)
  },
  {
    path: 'ml-predicciones',
    loadComponent: () => import('./pages/ml-predicciones/ml-predicciones.page').then((m) => m.MlPrediccionesPage)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reportes/reportes.page').then((m) => m.ReportesPage)
  },
  {
    path: 'reportes/control-operacion',
    loadComponent: () => import('./pages/reportes/control-operacion/control-operacion.page').then((m) => m.ControlOperacionPage)
  },
  {
    path: 'reportes/monitoreo-fisicoquimico',
    loadComponent: () => import('./pages/reportes/monitoreo-fisicoquimico/monitoreo-fisicoquimico.page').then((m) => m.MonitoreoFisicoquimicoPage)
  },
  {
    path: 'reportes/control-cloro',
    loadComponent: () => import('./pages/reportes/control-cloro/control-cloro.page').then((m) => m.ControlCloroPage)
  },
  {
    path: 'reportes/produccion-filtros',
    loadComponent: () => import('./pages/reportes/produccion-filtros/produccion-filtros.page').then((m) => m.ProduccionFiltrosPage)
  },
  {
    path: 'reportes/consumo-mensual',
    loadComponent: () => import('./pages/reportes/consumo-mensual/consumo-mensual.page').then((m) => m.ConsumoMensualPage)
  },
  {
    path: 'reportes/consumo-diario',
    loadComponent: () => import('./pages/reportes/consumo-diario/consumo-diario.page').then((m) => m.ConsumoDiarioPage)
  },
  {
    path: 'reportes/registro-reactivos',
    loadComponent: () => import('./pages/reportes/registro-reactivos/registro-reactivos.page').then((m) => m.RegistroReactivosPage)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
