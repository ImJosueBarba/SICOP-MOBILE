# SICOP Mobile - Arquitectura Profesional

## 📋 Descripción General

Aplicación móvil híbrida desarrollada con **Ionic Framework 8** y **Angular 20** (Standalone Components) siguiendo principios de **Clean Architecture** para el sistema de control de operaciones de la Planta de Tratamiento de Agua "La Esperanza".

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
src/app/
├── core/                          # Módulo Core - Singleton Services
│   ├── constants/                 # Constantes globales
│   │   └── api.constants.ts      # URLs, códigos HTTP, mensajes de error
│   ├── guards/                    # Route Guards
│   │   ├── auth.guard.ts         # Protección de rutas autenticadas
│   │   └── index.ts              
│   ├── interceptors/              # HTTP Interceptors
│   │   ├── auth.interceptor.ts   # Inyección automática de JWT
│   │   ├── error.interceptor.ts  # Manejo global de errores HTTP
│   │   ├── logging.interceptor.ts # Logging de requests (solo dev)
│   │   └── index.ts
│   ├── models/                    # Modelos compartidos globalmente
│   │   ├── api-response.model.ts
│   │   ├── auth.model.ts
│   │   └── index.ts
│   ├── services/                  # Servicios core singleton
│   │   ├── api.service.ts        # Servicio HTTP centralizado
│   │   ├── error-handler.service.ts  # Manejo de errores
│   │   ├── loading.service.ts    # Gestión de loadings
│   │   ├── storage.service.ts    # Wrapper de localStorage
│   │   ├── toast.service.ts      # Notificaciones al usuario
│   │   └── index.ts
│   └── index.ts                   # Barrel export
│
├── shared/                        # Componentes/Pipes/Directivas reutilizables
│   ├── components/                # Componentes compartidos
│   ├── directives/                # Directivas custom
│   └── pipes/                     # Pipes personalizados
│
├── features/                      # Módulos por funcionalidad (Feature Modules)
│   ├── auth/                      # Feature: Autenticación
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── models/
│   │   └── pages/
│   │       └── login/
│   ├── dashboard/                 # Feature: Dashboard principal
│   ├── reportes/                  # Feature: Reportes operacionales
│   │   ├── services/
│   │   │   └── reportes.service.ts
│   │   ├── models/
│   │   │   └── reportes.model.ts
│   │   └── pages/
│   │       ├── control-operacion/
│   │       ├── monitoreo-fisicoquimico/
│   │       ├── control-cloro/
│   │       ├── produccion-filtros/
│   │       ├── consumo-mensual/
│   │       ├── consumo-diario/
│   │       └── registro-reactivos/
│   └── ml/                        # Feature: Machine Learning
│       ├── services/
│       │   └── ml.service.ts
│       ├── models/
│       │   └── ml.model.ts
│       └── pages/
│           └── ml-predicciones/
│
├── pages/                         # Páginas legacy (migrar a features/)
├── app.component.ts               # Componente raíz
├── app.routes.ts                  # Configuración de rutas
└── app.config.ts                  # Configuración de providers

environments/
├── environment.ts                 # Variables de entorno (desarrollo)
└── environment.prod.ts            # Variables de entorno (producción)
```

## 🔧 Servicios Core

### ApiService
**Ubicación:** `core/services/api.service.ts`

Servicio centralizado para todas las peticiones HTTP. Incluye:
- Métodos tipados: `get<T>()`, `post<T>()`, `put<T>()`, `patch<T>()`, `delete<T>()`
- Loading automático configurable
- Manejo de errores centralizado
- Timeout y retry automático
- Construcción inteligente de URLs

**Ejemplo de uso:**
```typescript
this.apiService.get<User[]>('/users', { role: 'admin' }, {
  loadingMessage: 'Cargando usuarios...',
  showLoading: true
});
```

### ErrorHandlerService
**Ubicación:** `core/services/error-handler.service.ts`

Maneja errores HTTP de forma centralizada:
- Extrae mensajes de error del backend (FastAPI)
- Muestra notificaciones Toast apropiadas
- Logging centralizado de errores
- Diferencia entre errores de red, autenticación, validación, servidor

### LoadingService
**Ubicación:** `core/services/loading.service.ts`

Gestiona spinners de carga:
- Stack de loadings para evitar conflictos
- Método `withLoading()` para ejecutar operaciones con loading automático
- Control de loading único activo

### ToastService
**Ubicación:** `core/services/toast.service.ts`

Notificaciones tipo Toast con métodos pre-configurados:
- `success()` - Verde con ícono de check
- `error()` - Rojo con ícono de alerta
- `warning()` - Amarillo con ícono de advertencia
- `info()` - Azul con ícono de información

### StorageService
**Ubicación:** `core/services/storage.service.ts`

Wrapper de localStorage con funciones tipadas:
- Serialización/deserialización automática
- Métodos específicos para auth (`setAuthToken`, `getUserData`)
- Manejo seguro de excepciones

## 🛡️ Seguridad

### Guards

#### AuthGuard
Protege rutas que requieren autenticación. Redirige a `/login` si no hay token válido.

```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () => import('./pages/dashboard/dashboard.page')
}
```

#### GuestGuard
Protege rutas públicas (login). Redirige a `/dashboard` si ya está autenticado.

### Interceptores

#### AuthInterceptor
Inyecta automáticamente el token JWT en el header `Authorization` de todas las peticiones HTTP (excepto URLs públicas).

#### ErrorInterceptor
Captura errores HTTP globalmente:
- `401 Unauthorized` → Limpia sesión y redirige a login
- `403 Forbidden` → Log de acceso denegado
- Otros errores → Logging centralizado

#### LoggingInterceptor
Solo activo en modo desarrollo. Muestra logs detallados de requests/responses.

## 📡 Integración con Backend

### Configuración de Environment

**development (`environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

**production (`environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api-produccion.esperanza.com/api'
};
```

### Endpoints Backend (FastAPI)

La aplicación consume los siguientes endpoints:

**Autenticación:**
- `POST /auth/token` - Login con OAuth2
- `GET /auth/me` - Perfil del usuario autenticado

**Reportes:**
- `GET /control-operacion` - Control de operación
- `GET /monitoreo-fisicoquimico` - Monitoreo fisicoquímico
- `GET /control-cloro` - Control de cloro libre
- `GET /produccion-filtros` - Producción de filtros
- `GET /consumo-mensual` - Consumo químico mensual
- `GET /consumo-diario` - Consumo químico diario
- `GET /quimicos` - Lista de reactivos

**Machine Learning:**
- `POST /ml/predict` - Predicción de consumo químico
- `POST /ml/train` - Entrenar modelo
- `GET /ml/anomalies` - Detección de anomalías
- `GET /ml/model/info` - Información del modelo
- `GET /ml/stats` - Estadísticas del sistema
- `POST /ml/model/reload` - Recargar modelo

## 🚀 Buenas Prácticas Implementadas

### 1. **Tipado Fuerte (TypeScript)**
- Interfaces tipadas para todos los modelos
- No uso de `any` (excepto casos muy justificados)
- Tipado genérico en servicios (`get<T>`, `post<T>`)

### 2. **Separación de Responsabilidades**
- Componentes solo manejan UI
- Lógica de negocio en servicios
- Modelos en archivos separados
- Constantes centralizadas

### 3. **Manejo de Errores**
- Try-catch en operaciones async
- Propagación de errores con throwError()
- Manejo centralizado con ErrorHandlerService
- Mensajes de error amigables al usuario

### 4. **Performance**
- Lazy loading de páginas
- Standalone components (Angular 20)
- PreloadAllModules strategy
- Cacheo de datos cuando corresponde

### 5. **Seguridad**
- Tokens JWT en localStorage (con StorageService)
- Guards en todas las rutas protegidas
- Interceptor automático de autenticación
- Validación de sesión expirada

### 6. **Código Limpio**
- Barrel exports (`index.ts`)
- Nomenclatura consistente
- Métodos pequeños y enfocados
- Comentarios JSDoc en funciones públicas

## 📦 Dependencias Principales

```json
{
  "@angular/core": "^20.0.0",
  "@angular/forms": "^20.0.0",
  "@angular/router": "^20.0.0",
  "@ionic/angular": "^8.0.0",
  "rxjs": "~7.8.0",
  "ionicons": "^7.0.0"
}
```

## 🔄 Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. `AuthService.login()` envía FormData a `/auth/token`
3. Backend devuelve `access_token`
4. Token se guarda en localStorage via `StorageService`
5. `AuthService` carga perfil del usuario (`/auth/me`)
6. Datos de usuario se guardan en BehaviorSubject y localStorage
7. `AuthInterceptor` inyecta token automáticamente en requests
8. `ErrorInterceptor` detecta 401 y limpia sesión si token expira
9. `AuthGuard` protege rutas verificando token

## 📝 Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm start
# o
ionic serve

# Compilar para producción
ionic build --prod

# Ejecutar tests unitarios
npm test

# Ejecutar linter
npm run lint
```

### Deploy iOS/Android
```bash
# Sincronizar con Capacitor
ionic capacitor sync

# Abrir en Android Studio
ionic capacitor open android

# Abrir en Xcode
ionic capacitor open ios
```

## 🧪 Testing

Tests unitarios con Jasmine/Karma:
- Servicios: Mocks con `jasmine.createSpyObj`
- Componentes: TestBed con imports standalone
- Interceptores: Pruebas con HttpClientTestingModule

**Ejemplo:**
```typescript
it('should load model info on init', () => {
  mlServiceSpy.getModelInfo.and.returnValue(of(mockModelInfo));
  component.ngOnInit();
  expect(mlServiceSpy.getModelInfo).toHaveBeenCalled();
});
```

## 📄 Licencia

Proyecto académico - Universidad [Nombre]

---

**Desarrollado con ❤️ por el equipo de desarrollo**
