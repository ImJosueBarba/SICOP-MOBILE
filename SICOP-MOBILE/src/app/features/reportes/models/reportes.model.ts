/**
 * Modelos de datos para el módulo de Reportes
 */

export interface ControlOperacion {
  id: number;
  fecha: string;
  hora: string;
  turbedad_ac?: number;
  turbedad_at?: number;
  color?: string;
  ph_ac?: number;
  ph_sulf?: number;
  ph_at?: number;
  dosis_sulfato?: number;
  dosis_cal?: number;
  dosis_floergel?: number;
  ff?: number;
  clarificacion_is?: number;
  clarificacion_cs?: number;
  clarificacion_fs?: number;
  presion_psi?: number;
  presion_pre?: number;
  presion_pos?: number;
  presion_total?: number;
  cloro_residual?: number;
  observaciones?: string;
  usuario_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MonitoreoFisicoquimico {
  id: number;
  fecha: string;
  muestra_numero: number;
  hora: string;
  lugar_agua_cruda?: string;
  lugar_agua_tratada?: string;
  ac_ph?: number;
  ac_ce?: number;
  ac_tds?: number;
  ac_salinidad?: number;
  ac_temperatura?: number;
  at_ph?: number;
  at_ce?: number;
  at_tds?: number;
  at_salinidad?: number;
  at_temperatura?: number;
  observaciones?: string;
  usuario_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ControlCloroLibre {
  id: number;
  fecha_mes: string;
  documento_soporte: string;
  proveedor_solicitante: string;
  codigo: string;
  especificacion: string;
  cantidad_entra?: number;
  cantidad_sale?: number;
  cantidad_saldo?: number;
  observaciones?: string;
  usuario_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProduccionFiltro {
  id: number;
  fecha: string;
  hora: string;
  filtro1_h?: number;
  filtro1_q?: number;
  filtro2_h?: number;
  filtro2_q?: number;
  filtro3_h?: number;
  filtro3_q?: number;
  filtro4_h?: number;
  filtro4_q?: number;
  filtro5_h?: number;
  filtro5_q?: number;
  filtro6_h?: number;
  filtro6_q?: number;
  caudal_total?: number;
  observaciones?: string;
  usuario_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ConsumoQuimicoMensual {
  id: number;
  mes: number;
  anio: number;
  sulfato_con?: number;
  sulfato_ing?: number;
  sulfato_guia?: string;
  sulfato_re?: number;
  cal_con?: number;
  cal_ing?: number;
  cal_guia?: string;
  hipoclorito_con?: number;
  hipoclorito_ing?: number;
  hipoclorito_guia?: string;
  cloro_gas_con?: number;
  cloro_gas_ing_bal?: number;
  cloro_gas_ing_bdg?: number;
  cloro_gas_guia?: string;
  cloro_gas_egre?: number;
  observaciones?: string;
  usuario_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ConsumoQuimicoDiario {
  id: number;
  fecha: string;
  quimico_id: number;
  quimico_nombre?: string;
  bodega_ingresa?: number;
  bodega_egresa?: number;
  bodega_stock?: number;
  tanque1_hora?: string;
  tanque1_lectura_inicial?: number;
  tanque1_lectura_final?: number;
  tanque1_consumo?: number;
  tanque2_hora?: string;
  tanque2_lectura_inicial?: number;
  tanque2_lectura_final?: number;
  tanque2_consumo?: number;
  total_consumo?: number;
  observaciones?: string;
  usuario_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Filtro {
  id: number;
  nombre: string;
  tipo?: string;
  capacidad?: number;
  estado?: string;
}

export interface Reactivo {
  id: number;
  nombre: string;
  descripcion?: string;
  unidad_medida: string;
  stock_actual?: number;
  stock_minimo?: number;
  precio_unitario?: number;
  proveedor?: string;
  fecha_vencimiento?: string;
  lote?: string;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DateRangeFilter {
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface MonthYearFilter {
  mes?: number;
  anio?: number;
}
