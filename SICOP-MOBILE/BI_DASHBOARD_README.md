
# 🏭 SICOP - Sistema BI Industrial

**Transformación completada**: Aplicación móvil ahora funciona como herramienta de **Business Intelligence industrial** para toma de decisiones críticas en planta de tratamiento de agua.

---

## 📊 Funcionalidades BI Implementadas

### 1. **Dashboard con KPIs en Tiempo Real**
✅ **KPIs Operacionales:**
- Turbedad Agua Cruda/Tratada (FTU)
- pH Agua Cruda/Tratada
- Cloro Residual (mg/L)
- Presión del Sistema (PSI)
- Caudal (m³/h)
- Temperatura (°C)

✅ **Indicadores de Estado:**
- 🟢 **Verde**: Operación normal
- 🟡 **Ámbar**: Advertencia - valores cercanos a umbrales
- 🔴 **Rojo**: Crítico - requiere acción inmediata

✅ **Tendencias:**
- ↗️ Subiendo / ↘️ Bajando / → Estable
- Comparación con lectura anterior

### 2. **Sistema de Alertas de Umbral**
✅ **Detección Automática:**
- Evaluación continua de parámetros vs. umbrales configurados
- Umbrales basados en normas OMS y estándares de agua potable
- Niveles: Warning y Critical

✅ **Gestión de Alertas:**
- Badge de alertas activas en dashboard
- Modal con historial de alertas
- Reconocimiento individual o masivo
- Animación de pulso para alertas críticas

✅ **Umbrales Configurados:**
```typescript
// Ejemplo: Cloro Residual
Normal: 0.5 - 1.5 mg/L
Advertencia: 0.3 - 2.0 mg/L
Crítico: < 0.2 o > 5.0 mg/L
```

### 3. **Filtros de Tiempo Rápidos**
✅ **Presets Disponibles:**
- **Últimas 24h**: Actualización cada minuto
- **Turno Actual**: Detecta automáticamente turno (6AM-2PM, 2PM-10PM, 10PM-6AM)
- **Comparativo Semanal**: Últimos 7 días para análisis de tendencias
- **Personalizado**: Selección manual de fechas

✅ **UX Optimizada:**
- Chips seleccionables con indicador visual
- Un toque para cambiar vista
- Actualización automática según preset

### 4. **Sistema de Ayuda In-App**
✅ **Categorías:**
- Dashboard (interpretación de KPIs, filtros)
- Alertas (significado, umbrales, acciones)
- Reportes (exportación, tipos disponibles)
- ML (predicciones, anomalías, confianza)
- General (offline, navegación, tips)

✅ **Funcionalidades:**
- Búsqueda de temas por palabra clave
- Navegación por categorías
- Contenido HTML rico (tablas, listas, énfasis)
- Accesible desde cualquier pantalla (botón en toolbar)

✅ **Temas Incluidos:**
1. Interpretación del Dashboard
2. Filtros de Tiempo Rápidos
3. Qué Significan las Alertas
4. Cómo Exportar Reportes
5. Uso de Predicciones ML
6. Modo Offline y Caché
7. Consejos de Navegación

### 5. **Modo Offline con Caché**
✅ **CacheService:**
- Almacenamiento local de últimos datos del dashboard
- Detección automática de conectividad
- Expiración de caché (24 horas por defecto)
- Gestión de tamaño de caché

✅ **Funcionalidades:**
- Visualización de último dashboard cargado sin internet
- Indicador de modo offline
- Sincronización automática al recuperar conexión
- Limpieza de entradas expiradas

---

## 🗂️ Arquitectura Implementada

### **Modelos**
```
src/app/models/
├── dashboard.model.ts    # KPIValue, KPIDashboard, ThresholdAlert, TimeFilter, THRESHOLD_CONFIGS
└── help.model.ts         # HelpTopic, HelpCategory, HELP_TOPICS
```

### **Servicios**
```
src/app/services/
├── dashboard-kpi.service.ts  # Carga de KPIs desde backend
├── threshold.service.ts      # Evaluación y gestión de alertas
├── help.service.ts          # Sistema de ayuda y modal
├── cache.service.ts         # Modo offline y almacenamiento local
└── reportes.service.ts      # Existente - integrado con KPIs
```

### **Componentes Compartidos**
```
src/app/shared/components/
├── time-filter/             # Filtros de tiempo rápidos (chip selector)
│   ├── time-filter.component.ts
│   ├── time-filter.component.html
│   └── time-filter.component.scss
└── help-modal/              # Modal de ayuda con búsqueda
    ├── help-modal.component.ts
    ├── help-modal.component.html
    └── help-modal.component.scss
```

### **Páginas**
```
src/app/pages/
└── dashboard/
    ├── dashboard.page.ts    # Actualizado con KPIs reales
    ├── dashboard.page.html  # Grid de KPI cards + filtros + alertas
    └── dashboard.page.scss  # Estilos industriales con badges de estado
```

---

## 🎨 Design System Aplicado

### **Colores de Estado**
```scss
.kpi-card {
  &.status-normal {
    border-left: 4px solid var(--ion-color-success); // Verde
  }
  &.status-warning {
    border-left: 4px solid var(--ion-color-warning); // Ámbar
  }
  &.status-critical {
    border-left: 4px solid var(--ion-color-danger); // Rojo
    animation: pulse 2s infinite; // Animación de atención
  }
}
```

### **Tipografía & Espaciado**
- **Valores KPI**: 32px, font-weight 700
- **Unidades**: 16px, color medium
- **Umbrales**: 12px, color medium
- **Badges**: 11px, padding 4px 8px

---

## 🔧 Integración con Backend

### **Endpoints Utilizados**
```typescript
// DashboardKPIService utiliza:
reportesService.getControlOperacion(fechaInicio, fechaFin)
// Retorna: ControlOperacion[]
// Campos: turbedad_ac, turbedad_at, ph_ac, ph_at, cloro_residual, 
//         presion_psi, caudal, temperatura, fecha, hora, etc.
```

### **Flujo de Datos**
```
1. Usuario selecciona filtro de tiempo (ej: "Últimas 24h")
2. TimeFilterComponent emite TimeFilter con start/end dates
3. DashboardPage llama a DashboardKPIService.loadKPIDashboard(filter)
4. Servicio consulta backend con fechaInicio/fechaFin
5. Transforma ControlOperacion[] a KPIDashboard
6. Evalúa umbrales con ThresholdService
7. Genera alertas si valores exceden límites
8. Actualiza vista con KPIs, badges de estado y alertas
```

---

## 📱 Uso y Navegación

### **Dashboard**
1. **Al abrir**: Muestra KPIs de últimas 24h (por defecto)
2. **Cambiar filtro**: Toca chip de filtro deseado → Datos se actualizan automáticamente
3. **Ver detalles**: Cada tarjeta KPI muestra:
   - Valor actual
   - Estado (badge coloreado)
   - Tendencia (ícono de flecha)
   - Rango normal esperado
4. **Alertas**: Si hay alertas críticas, banner amarillo aparece arriba → Toca "Ver" para detalles

### **Ayuda**
1. **Desde Dashboard**: Toca ícono ❓ en toolbar superior derecho
2. **Búsqueda**: Usa barra de búsqueda para encontrar temas (ej: "cloro", "turno", "excel")
3. **Categorías**: Filtra por Dashboard, Alertas, Reportes, ML, General
4. **Leer tema**: Toca cualquier tema para ver detalles completos con tablas y ejemplos

---

## 🚀 Próximos Pasos (Opcional)

### **Gráficas de Tendencias**
- Integrar Chart.js o Apache ECharts
- Líneas de tiempo para turbedad, pH, cloro
- Touch gestures (zoom, pan)

### **Notificaciones Push**
- Firebase Cloud Messaging
- Alertas críticas en tiempo real
- Recordatorios de cambio de turno

### **Exportación de Dashboard**
- PDF snapshot del dashboard actual
- CSV de datos filtrados
- Compartir vía WhatsApp/Email

---

## 📝 Notas Técnicas

### **Umbrales Configurables**
Los umbrales están centralizados en `THRESHOLD_CONFIGS` (dashboard.model.ts).  
Para modificar rangos:
```typescript
{
  parameter: 'chlorineResidual',
  critical: { min: 0, max: 5 },     // Fuera de estos = CRÍTICO
  warning: { min: 0.3, max: 2 },    // Fuera de estos = ADVERTENCIA
  normal: { min: 0.5, max: 1.5 }    // Dentro = NORMAL
}
```

### **Intervalo de Actualización**
```typescript
// TIME_FILTER_PRESETS en dashboard.model.ts
{ preset: '24h', label: 'Últimas 24h', refreshInterval: 60000 }  // 1 minuto
{ preset: 'shift', label: 'Turno Actual', refreshInterval: 300000 } // 5 minutos
{ preset: 'weekly', label: 'Comparativo Semanal', refreshInterval: 0 } // Sin auto-refresh
```

### **Caché Offline**
```typescript
// Configuración en cache.service.ts
CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas

// Uso:
cacheService.set('dashboard_data', dashboardObject);
const cachedData = cacheService.get<KPIDashboard>('dashboard_data');
```

---

## ✅ Checklist de Implementación

- [x] Modelos de KPI, Alertas, Filtros
- [x] DashboardKPIService con carga de datos
- [x] ThresholdService con evaluación de umbrales
- [x] TimeFilterComponent con chips
- [x] HelpModalComponent con búsqueda
- [x] HelpService con 7 temas documentados
- [x] CacheService para modo offline
- [x] Dashboard actualizado con KPI cards
- [x] Estilos industriales (badges, borders, animaciones)
- [x] Integración con ReportesService existente
- [x] Alerts modal con reconocimiento
- [ ] Gráficas de tendencias (opcional)
- [ ] Push notifications (opcional)
- [ ] Export dashboard (opcional)

---

## 🎯 Resultado Final

La aplicación ha sido transformada de una **herramienta básica de reportes** a un **sistema BI industrial completo** que permite:

✅ **Monitoreo en tiempo real** de parámetros operacionales críticos  
✅ **Toma de decisiones rápida** con indicadores de estado visual  
✅ **Gestión proactiva** mediante alertas de umbral automáticas  
✅ **Acceso móvil** optimizado para operadores en campo  
✅ **Documentación integrada** con sistema de ayuda contextual  
✅ **Operación offline** con caché de último estado  

---

**Desarrollado para Mancomunidad La Esperanza**  
Sistema de Control Operacional de Planta de Tratamiento de Agua
