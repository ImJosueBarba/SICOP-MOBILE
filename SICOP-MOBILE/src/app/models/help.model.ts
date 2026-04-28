/**
 * Help System Models - Sistema de Ayuda In-App
 */

export interface HelpTopic {
  id: string;
  title: string;
  category: HelpCategory;
  icon: string;
  content: string;
  keywords: string[];
  order: number;
}

export type HelpCategory = 'dashboard' | 'alerts' | 'reports' | 'ml' | 'general';

/**
 * Temas de ayuda pre-configurados
 */
export const HELP_TOPICS: HelpTopic[] = [
  // DASHBOARD
  {
    id: 'dashboard-interpretation',
    title: 'Interpretación del Dashboard',
    category: 'dashboard',
    icon: 'bar-chart-outline',
    order: 1,
    keywords: ['dashboard', 'kpi', 'interpretación', 'lectura', 'valores'],
    content: `
      <h3>Dashboard de Control Operacional</h3>
      <p>El dashboard muestra indicadores clave (KPIs) en tiempo real de la planta de tratamiento de agua.</p>
      
      <h4>KPIs Principales:</h4>
      <ul>
        <li><strong>Turbedad AC/AT:</strong> Mide la claridad del agua antes y después del tratamiento (FTU)</li>
        <li><strong>pH AC/AT:</strong> Nivel de acidez/alcalinidad del agua cruda y tratada</li>
        <li><strong>Cloro Residual:</strong> Concentración de cloro libre en agua tratada (mg/L)</li>
        <li><strong>Presión:</strong> Presión del sistema en PSI</li>
      </ul>

      <h4>Colores de Estado:</h4>
      <ul>
        <li><strong style="color: #7AB800;">Verde:</strong> Operación normal - valores dentro de rango</li>
        <li><strong style="color: #FFA500;">Ámbar:</strong> Advertencia - valores cercanos a límites</li>
        <li><strong style="color: #D32F2F;">Rojo:</strong> Crítico - valores fuera de rango, requiere acción inmediata</li>
      </ul>
    `
  },
  {
    id: 'time-filters',
    title: 'Filtros de Tiempo Rápidos',
    category: 'dashboard',
    icon: 'time-outline',
    order: 2,
    keywords: ['filtros', 'tiempo', '24h', 'turno', 'semanal', 'comparativo'],
    content: `
      <h3>Filtros de Tiempo</h3>
      <p>Los filtros permiten visualizar datos de diferentes períodos con un solo toque.</p>
      
      <h4>Filtros Disponibles:</h4>
      <ul>
        <li><strong>Últimas 24h:</strong> Datos de las últimas 24 horas, actualización cada minuto</li>
        <li><strong>Turno Actual:</strong> Datos del turno en curso (6AM-2PM, 2PM-10PM, 10PM-6AM)</li>
        <li><strong>Comparativo Semanal:</strong> Datos de los últimos 7 días para análisis de tendencias</li>
        <li><strong>Personalizado:</strong> Seleccione fechas específicas manualmente</li>
      </ul>

      <p><strong>Tip:</strong> Use "Turno Actual" para monitoreo activo y "Comparativo Semanal" para análisis de rendimiento.</p>
    `
  },

  // ALERTAS
  {
    id: 'alert-meaning',
    title: 'Qué Significan las Alertas',
    category: 'alerts',
    icon: 'alert-circle-outline',
    order: 3,
    keywords: ['alertas', 'alarmas', 'crítico', 'advertencia', 'umbrales', 'notificaciones'],
    content: `
      <h3>Sistema de Alertas de Umbral</h3>
      <p>Las alertas se generan automáticamente cuando los parámetros operacionales exceden umbrales seguros.</p>
      
      <h4>Niveles de Severidad:</h4>
      <ul>
        <li>
          <strong style="color: #FFA500;">⚠️ ADVERTENCIA:</strong> 
          Parámetro fuera de rango óptimo pero dentro de límite aceptable. 
          Monitorear y considerar ajustes.
        </li>
        <li>
          <strong style="color: #D32F2F;">🔴 CRÍTICO:</strong> 
          Parámetro fuera de límites de seguridad. 
          <strong>Requiere acción inmediata.</strong>
        </li>
      </ul>

      <h4>Umbrales por Parámetro:</h4>
      <table style="width:100%; border-collapse: collapse;">
        <tr><th>Parámetro</th><th>Normal</th><th>Advertencia</th><th>Crítico</th></tr>
        <tr><td>Turbedad AC</td><td>5-30 FTU</td><td>30-40 FTU</td><td>&gt;50 FTU</td></tr>
        <tr><td>Turbedad AT</td><td>0.1-0.5 FTU</td><td>0.5-1 FTU</td><td>&gt;1 FTU</td></tr>
        <tr><td>pH AT</td><td>6.8-8.0</td><td>6.5-8.5</td><td>&lt;6.0 o &gt;9.0</td></tr>
        <tr><td>Cloro Residual</td><td>0.5-1.5 mg/L</td><td>0.3-2 mg/L</td><td>&lt;0.2 o &gt;5 mg/L</td></tr>
      </table>

      <p><strong>Acción Requerida:</strong> Al recibir alertas críticas, verificar dosificación de químicos y condiciones de operación.</p>
    `
  },

  // REPORTES
  {
    id: 'export-reports',
    title: 'Cómo Exportar Reportes',
    category: 'reports',
    icon: 'download-outline',
    order: 4,
    keywords: ['exportar', 'excel', 'csv', 'pdf', 'reportes', 'compartir', 'descargar'],
    content: `
      <h3>Exportación de Reportes</h3>
      <p>Los reportes se pueden exportar en formato Excel (.xlsx) para análisis offline o compartir con supervisores.</p>
      
      <h4>Pasos para Exportar:</h4>
      <ol>
        <li>Navegue a <strong>Reportes</strong> en el menú principal</li>
        <li>Seleccione el tipo de reporte (Control Operación, Monitoreo Fisicoquímico, etc.)</li>
        <li>Configure el rango de fechas deseado</li>
        <li>Toque el botón <strong>Exportar Excel</strong> (ícono de descarga)</li>
        <li>El archivo se guardará en su dispositivo</li>
      </ol>

      <h4>Reportes Disponibles:</h4>
      <ul>
        <li><strong>Control de Operación:</strong> Parámetros operacionales completos (pH, turbedad, dosificación)</li>
        <li><strong>Monitoreo Fisicoquímico:</strong> Análisis detallado de calidad de agua</li>
        <li><strong>Registro de Reactivos:</strong> Inventario y consumo de químicos</li>
        <li><strong>Producción de Filtros:</strong> Rendimiento de filtros individuales</li>
        <li><strong>Consumo Diario/Mensual:</strong> Análisis de consumo químico</li>
      </ul>

      <p><strong>Formato:</strong> Todos los archivos incluyen encabezados, fechas ISO y campos editables en Excel.</p>
    `
  },

  // MACHINE LEARNING
  {
    id: 'ml-predictions',
    title: 'Uso de Predicciones ML',
    category: 'ml',
    icon: 'stats-chart-outline',
    order: 5,
    keywords: ['machine learning', 'ml', 'predicción', 'anomalías', 'modelo', 'ia', 'inteligencia artificial'],
    content: `
      <h3>Predicciones con Machine Learning</h3>
      <p>El sistema utiliza algoritmos de ML para predecir valores futuros y detectar anomalías operacionales.</p>
      
      <h4>Funcionalidades:</h4>
      <ul>
        <li>
          <strong>Predicción:</strong> Estima valores futuros de pH, turbedad y cloro basándose en datos históricos
        </li>
        <li>
          <strong>Detección de Anomalías:</strong> Identifica patrones inusuales que podrían indicar problemas
        </li>
        <li>
          <strong>Información del Modelo:</strong> Muestra precisión, última fecha de entrenamiento y métricas
        </li>
      </ul>

      <h4>Interpretación de Resultados:</h4>
      <ul>
        <li><strong>Confianza Alta (&gt;80%):</strong> Predicción confiable, use como referencia</li>
        <li><strong>Confianza Media (60-80%):</strong> Predicción razonable, verificar condiciones</li>
        <li><strong>Confianza Baja (&lt;60%):</strong> Variabilidad alta, monitorear activamente</li>
      </ul>

      <h4>Anomalías Detectadas:</h4>
      <p>Las anomalías se marcan con ⚠️ y describen la desviación observada. Verifique causas posibles:</p>
      <ul>
        <li>Cambio abrupto en calidad de agua cruda</li>
        <li>Error en dosificación de químicos</li>
        <li>Falla en equipo de medición</li>
        <li>Condiciones climáticas extremas</li>
      </ul>
    `
  },

  // GENERAL
  {
    id: 'offline-mode',
    title: 'Modo Offline y Caché',
    category: 'general',
    icon: 'cloud-offline-outline',
    order: 6,
    keywords: ['offline', 'sin conexión', 'cache', 'sincronización', 'internet'],
    content: `
      <h3>Modo Offline</h3>
      <p>La aplicación puede funcionar sin conexión a internet utilizando datos en caché.</p>
      
      <h4>Funcionalidades Offline:</h4>
      <ul>
        <li>Visualización del último dashboard cargado</li>
        <li>Acceso a reportes previamente consultados</li>
        <li>Consulta de alertas históricas</li>
      </ul>

      <h4>Limitaciones Offline:</h4>
      <ul>
        <li>No se actualizan datos en tiempo real</li>
        <li>No se pueden generar nuevos reportes</li>
        <li>Predicciones ML no disponibles</li>
      </ul>

      <p><strong>Indicador:</strong> Un banner "Sin Conexión" aparece en la parte superior cuando no hay internet.</p>
      
      <h4>Sincronización:</h4>
      <p>Al recuperar conexión, la app sincroniza automáticamente los últimos datos y actualiza el dashboard.</p>
    `
  },

  {
    id: 'navigation-tips',
    title: 'Consejos de Navegación',
    category: 'general',
    icon: 'compass-outline',
    order: 7,
    keywords: ['navegación', 'menú', 'uso', 'tips', 'consejos', 'interface'],
    content: `
      <h3>Navegación Eficiente</h3>
      <p>Optimice el uso de la aplicación con estos consejos:</p>
      
      <h4>Atajos de Teclado:</h4>
      <ul>
        <li><strong>Menú:</strong> Toque el ícono ☰ en la esquina superior izquierda</li>
        <li><strong>Ayuda:</strong> Toque el ícono ❓ en la esquina superior derecha</li>
        <li><strong>Atrás:</strong> Use el botón ← del navegador o gesto deslizar desde borde izquierdo</li>
      </ul>

      <h4>Gestos Táctiles:</h4>
      <ul>
        <li><strong>Deslizar hacia abajo:</strong> Refresca datos en cualquier página</li>
        <li><strong>Tocar tarjeta KPI:</strong> Ver detalles y gráfica de tendencia</li>
        <li><strong>Mantener presionado:</strong> Opciones contextuales en algunos elementos</li>
      </ul>

      <h4>Flujo de Trabajo Recomendado:</h4>
      <ol>
        <li><strong>Al iniciar turno:</strong> Revise Dashboard con filtro "Turno Actual"</li>
        <li><strong>Cada 30 min:</strong> Verifique alertas nuevas (badge en menú)</li>
        <li><strong>Al finalizar turno:</strong> Exporte reporte de Control de Operación</li>
        <li><strong>Semanalmente:</strong> Revise Comparativo Semanal y anomalías ML</li>
      </ol>
    `
  }
];
