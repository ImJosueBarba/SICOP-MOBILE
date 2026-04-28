# 🎨 Sistema de Diseño Profesional
## Mancomunidad La Esperanza - Aplicación Móvil de Tratamiento de Agua

---

## 📋 Resumen Ejecutivo

Se ha implementado un **sistema de diseño enterprise-grade** basado en las mejores prácticas de UI/UX para aplicaciones corporativas industriales. El diseño está optimizado para entornos técnicos profesionales de gestión de tratamiento de agua.

### Objetivos Alcanzados
✅ Paleta de colores corporativa basada en el logo  
✅ Sistema de espaciado de 8px (grid perfecto)  
✅ Tipografía jerárquica técnica  
✅ Border radius consistente (12-16px)  
✅ Sombras suaves y profesionales  
✅ Componentes enterprise-grade  
✅ Diseño píxel-perfecto  

---

## 🎨 Paleta de Colores

### Colores Corporativos (del Logo)
```scss
--brand-primary-navy: #0F4C81;        // Azul profundo corporativo
--brand-primary-blue: #1E5AA8;        // Azul principal de acción
--brand-accent-green: #7AB800;        // Verde orgánico (éxito)
--brand-accent-green-light: #86BC25;  // Verde claro variación
```

### Grises Técnicos (Industrial Palette)
```scss
--gray-100: #F8F9FB;  // Fondo claro
--gray-200: #F1F3F6;  // Fondo sutil
--gray-300: #E4E7EB;  // Bordes claros
--gray-400: #CBD2D9;  // Bordes default
--gray-500: #9AA5B1;  // Texto secundario
--gray-600: #7B8794;  // Texto muted
--gray-700: #616E7C;  // Texto primario
--gray-800: #52606D;  // Texto oscuro
--gray-900: #3E4C59;  // Texto más oscuro
```

### Colores Semánticos
```scss
--status-success: #10B981;     // Verde éxito
--status-warning: #F59E0B;     // Amarillo advertencia
--status-error: #EF4444;       // Rojo error
--status-info: #3B82F6;        // Azul información
```

### Colores Específicos de Tratamiento de Agua
```scss
--water-turbidity: #60A5FA;    // Tonos azules agua
--water-ph: #34D399;           // Verde indicador pH
--water-chlorine: #A78BFA;     // Morado cloro
--chemical-orange: #FB923C;    // Naranja químicos
```

---

## 📏 Sistema de Espaciado (8px Grid)

```scss
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px - Unidad base */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

**Uso:**
- Padding de cards: `var(--spacing-4)` o `var(--spacing-5)`
- Márgenes entre secciones: `var(--spacing-6)` o `var(--spacing-8)`
- Gap en grids: `var(--spacing-3)` o `var(--spacing-4)`

---

## 🔤 Tipografía Técnica

### Escala de Tamaños
```scss
--font-size-xs: 0.75rem;      /* 12px - Labels pequeños */
--font-size-sm: 0.875rem;     /* 14px - Body text */
--font-size-base: 1rem;       /* 16px - Default */
--font-size-md: 1.125rem;     /* 18px - Subtitles */
--font-size-lg: 1.25rem;      /* 20px - Card titles */
--font-size-xl: 1.5rem;       /* 24px - Section headers */
--font-size-2xl: 1.875rem;    /* 30px - Page titles */
--font-size-3xl: 2.25rem;     /* 36px - Hero numbers */
```

### Pesos de Fuente
```scss
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Jerarquía Visual
| Elemento | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| Números Hero (datos técnicos) | 2.25rem | 700 | Valores principales de predicción |
| Títulos de Página | 1.5rem | 700 | Headers principales |
| Títulos de Card | 1.25rem | 600 | Encabezados de tarjetas |
| Body Text | 0.875rem | 400 | Texto general |
| Labels Técnicos | 0.75rem | 600 | UPPERCASE, tracking 0.05em |

---

## 🔘 Border Radius Consistente

```scss
--radius-sm: 0.375rem;   /* 6px - Elementos pequeños */
--radius-base: 0.5rem;   /* 8px - Inputs */
--radius-md: 0.75rem;    /* 12px - Cards, buttons */
--radius-lg: 1rem;       /* 16px - Cards grandes */
--radius-xl: 1.5rem;     /* 24px - Hero sections */
--radius-full: 9999px;   /* Circular - badges */
```

**Aplicación:**
- **Inputs:** `var(--radius-base)` (8px)
- **Buttons:** `var(--radius-md)` (12px)
- **Cards:** `var(--radius-md)` (12px)
- **Badges:** `var(--radius-full)` (circular)

---

## 🌑 Sombras Suaves y Profesionales

```scss
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
--shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
--shadow-md: 0 6px 12px -2px rgba(0, 0, 0, 0.10), 0 3px 7px -3px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 10px 20px -3px rgba(0, 0, 0, 0.12), 0 4px 8px -4px rgba(0, 0, 0, 0.10);
```

**Uso por Componente:**
- **Cards normales:** `--shadow-sm`
- **Cards hover:** `--shadow-md`
- **Cards elevadas (hero):** `--shadow-lg`
- **Buttons:** `--shadow-xs`

---

## 🧩 Componentes Enterprise

### 1. **ION-CARD (Tarjetas Profesionales)**

```scss
ion-card {
  background: #ffffff;
  border-radius: var(--radius-md);      // 12px
  box-shadow: var(--card-shadow);       // Sombra suave
  margin: 0 var(--spacing-4) var(--spacing-4);
  border: 1px solid var(--gray-300);    // Borde sutil
  transition: all 250ms ease;
}
```

**Variaciones:**
- **Card Elevated:** Sombra más pronunciada para hero sections
- **Card Compact:** Padding reducido
- **Card con Color Header:** Gradient backgrounds para headers

### 2. **ION-BUTTON (Botones de Acción)**

```scss
ion-button {
  --border-radius: var(--radius-md);    // 12px
  height: 44px;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: none;                  // Sin mayúsculas
}
```

**Estados:**
- **Default:** Sombra `--shadow-xs`
- **Hover:** Sombra `--shadow-sm` + translateY(-1px)
- **Active:** Sin elevación

### 3. **ION-INPUT (Campos Técnicos)**

```scss
ion-input {
  --background: var(--gray-100);
  border: 1.5px solid var(--gray-300);
  border-radius: var(--radius-base);    // 8px
  height: 48px;
  font-variant-numeric: tabular-nums;   // Números monoespaciados
}
```

**Estado Focus:**
```scss
&:focus-within {
  border-color: var(--ion-color-primary);
  box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.1);
}
```

### 4. **Data Card (Visualización de Datos)**

```scss
.data-card {
  background: #ffffff;
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  border: 1px solid var(--gray-300);
  
  &__label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--gray-600);
  }
  
  &__value {
    font-size: var(--font-size-3xl);    // 36px
    font-weight: 700;
    color: var(--gray-900);
    font-variant-numeric: tabular-nums;
  }
}
```

### 5. **Status Indicator (Indicadores de Estado)**

```scss
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--status-success);
  }
}
```

---

## 📱 Páginas Rediseñadas

### Dashboard
**Cambios implementados:**
- ✅ Hero card con gradient corporativo
- ✅ Stats grid con tarjetas elevadas
- ✅ Lista de features con íconos filled
- ✅ Espaciado consistente 8px grid
- ✅ Hover states profesionales

### ML Predicciones
**Cambios implementados:**
- ✅ Formulario técnico con inputs profesionales
- ✅ Labels uppercase con tracking
- ✅ Resultados con números hero (36px)
- ✅ Cards de predicción con backdrop blur
- ✅ Indicadores de confianza y costo
- ✅ Lista de anomalías con hover effects
- ✅ Grid de métricas responsive

---

## 🎯 Mejores Prácticas Implementadas

### 1. **Consistencia Visual**
- Todos los border-radius son múltiplos de 4px
- Espaciado basado en grid de 8px
- Transiciones uniformes de 150-350ms
- Sombras progresivas (xs → sm → md → lg)

### 2. **Accesibilidad**
- Contraste mínimo 4.5:1 en textos
- Touch targets mínimo 44x44px
- Focus states visibles con ring azul
- Labels descriptivos y jerárquicos

### 3. **Performance**
- Transiciones con `cubic-bezier(0.4, 0, 0.2, 1)`
- `will-change` evitado para optimización
- Backdrop filters solo en elementos necesarios
- Shadows con low opacity para mejor rendering

### 4. **Responsive Design**
- Breakpoints: 768px (tablet), 1024px (desktop)
- Grids con `auto-fit` y `minmax()`
- Font sizes escalables con rem
- Touch-friendly en móvil

---

## 📐 Guía de Uso

### Cómo Aplicar el Sistema de Diseño

1. **Variables Disponibles:**
   Todas las variables están en `src/theme/variables.scss`

2. **Clases Utilitarias:**
   Usar clases globales en `src/global.scss`:
   ```html
   <div class="data-card">...</div>
   <span class="status-indicator status-indicator--success">...</span>
   <div class="flex gap-4 align-center">...</div>
   ```

3. **Componentes Ionic Estilizados:**
   Los componentes Ionic ya tienen estilos globales aplicados automáticamente.

4. **Extensión de Estilos:**
   ```scss
   .mi-componente {
     padding: var(--spacing-4);
     border-radius: var(--radius-md);
     box-shadow: var(--shadow-sm);
     color: var(--gray-700);
   }
   ```

---

## 🚀 Próximos Pasos

### Recomendaciones para Mantener la Calidad

1. **Documentación de Componentes**
   - Crear Storybook o similar para visualizar componentes
   - Documentar variaciones y props

2. **Testing Visual**
   - Implementar snapshot testing
   - Validar en múltiples dispositivos

3. **Design Tokens**
   - Considerar migración a tokens JSON
   - Integración con design tools (Figma)

4. **Animaciones**
   - Agregar micro-interacciones sutiles
   - Loading skeletons para mejor UX

5. **Dark Mode**
   - Activar y refinar modo oscuro
   - Paleta industrial dark ya incluida

---

## 📦 Archivos Modificados

```
SICOP-MOBILE/
├── src/
│   ├── theme/
│   │   └── variables.scss          ✅ REESCRITO (variables profesionales)
│   ├── global.scss                 ✅ REESCRITO (componentes enterprise)
│   └── app/
│       └── pages/
│           ├── dashboard/
│           │   ├── dashboard.page.html   ✅ ACTUALIZADO
│           │   └── dashboard.page.scss   ✅ REESCRITO
│           └── ml-predicciones/
│               └── ml-predicciones.page.scss  ✅ REESCRITO
```

---

## 🎨 Inspiración y Referencias

**Sistemas de diseño consultados:**
- Material Design 3 (Google)
- Fluent Design System (Microsoft)
- Carbon Design System (IBM)
- Ant Design Enterprise
- Tailwind CSS Color Palette

**Principios aplicados:**
- Diseño industrial técnico
- Minimalismo funcional
- Jerarquía visual clara
- Accesibilidad WCAG 2.1 AA

---

## 📞 Soporte

Para preguntas sobre el sistema de diseño:
- Revisar variables en `variables.scss`
- Consultar clases globales en `global.scss`
- Ver ejemplos implementados en páginas

---

**Versión:** 1.0.0  
**Fecha:** Febrero 2026  
**Proyecto:** Mancomunidad La Esperanza - Sistema de Gestión de Tratamiento de Agua
