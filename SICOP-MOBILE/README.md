# SICOP Mobile - Sistema de Control de Operaciones

Aplicación móvil para el control de operaciones de la Planta de Tratamiento de Agua "La Esperanza".

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ y npm
- Ionic CLI: `npm install -g @ionic/cli`
- Angular CLI: `npm install -g @angular/cli`

### Instalación

```bash
# 1. Instalar dependencias
cd SICOP-MOBILE
npm install

# 2. Configurar variables de entorno
# Editar src/environments/environment.ts con la URL del backend
```

### Desarrollo

```bash
# Servidor de desarrollo con live reload
ionic serve

# O con npm
npm start

# La aplicación se abrirá en http://localhost:8100
```

### Build Producción

```bash
# Build optimizado
ionic build --prod

# Los archivos compilados estarán en www/
```

## 📱 Funcionalidades

### ✅ Implementadas

- **Autenticación JWT** con guards y sesión persistente
- **Dashboard ML** con predicciones de consumo químico
- **Detección de Anomalías** en tiempo real
- **Reportes Operacionales:**
  - Control de Operación
  - Monitoreo Fisicoquímico
  - Control de Cloro Libre
  - Producción de Filtros
  - Consumo Químico Mensual y Diario
  - Registro de Reactivos

### 🎯 Características Técnicas

- ✅ Clean Architecture (core/shared/features)
- ✅ Standalone Components (Angular 20)
- ✅ Tipado fuerte TypeScript
- ✅ HTTP Interceptors (Auth + Error)
- ✅ Manejo centralizado de errores
- ✅ Loading y Toast services
- ✅ Route Guards
- ✅ Lazy loading
- ✅ Responsive design

## 🏗️ Arquitectura

```
src/app/
├── core/              # Servicios singleton, guards, interceptores
├── shared/            # Componentes/pipes/directivas reutilizables
├── features/          # Módulos por funcionalidad
│   ├── auth/         # Autenticación
│   ├── reportes/     # Reportes operacionales
│   └── ml/           # Machine Learning
└── pages/            # Páginas de la app
```

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para documentación detallada.

## 🔧 Configuración

### Backend API

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'  // Cambiar a tu backend
};
```

### Credenciales de Prueba

- **Usuario:** admin
- **Contraseña:** admin123

## 📡 Conectividad con Backend

La app consume una API REST desarrollada en FastAPI (Python).

**Estado del Backend:** ✅ Operacional en `http://localhost:8000`

Endpoints principales:
- `/auth/token` - Autenticación
- `/control-operacion` - Datos operacionales
- `/ml/predict` - Predicciones ML
- `/ml/anomalies` - Detección de anomalías

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Tests con cobertura
npm run test:coverage
```

## 📦 Build Nativo

### Android

```bash
# 1. Agregar plataforma
ionic capacitor add android

# 2. Sincronizar
ionic capacitor sync android

# 3. Abrir en Android Studio
ionic capacitor open android
```

### iOS

```bash
# 1. Agregar plataforma
ionic capacitor add ios

# 2. Sincronizar
ionic capacitor sync ios

# 3. Abrir en Xcode
ionic capacitor open ios
```

## 🐛 Troubleshooting

### Error: Cannot find module '@angular/core'
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Port 8100 is already in use
```bash
ionic serve --port 8101
```

### Backend no responde
Verificar que el servidor FastAPI esté corriendo:
```bash
cd backend
uvicorn main:app --reload
```

## 📝 Scripts Disponibles

```bash
npm start              # Iniciar desarrollo
npm run build          # Build producción
npm test               # Ejecutar tests
npm run lint           # Linter
ionic serve            # Servidor dev con Ionic
ionic build --prod     # Build optimizado
```

## 👥 Equipo de Desarrollo

- **Arquitectura:** Clean Architecture + SOLID
- **Frontend:** Ionic 8 + Angular 20
- **Backend:** FastAPI + SQLAlchemy
- **ML:** scikit-learn + XGBoost + LightGBM

## 📄 Licencia

Proyecto académico - Universidad

---

**¿Necesitas ayuda?** Consulta [ARCHITECTURE.md](./ARCHITECTURE.md) para la documentación técnica completa.
