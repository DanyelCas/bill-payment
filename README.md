# 💳 Bill Payment - Sistema de Pago de Servicios

Single Page Application (SPA) profesional construida con **Angular 17** para gestionar el pago de facturas de servicios públicos. La aplicación permite consultar facturas pendientes por ID de cliente, revisar detalles de facturación y completar pagos de forma intuitiva y segura.

![Angular](https://img.shields.io/badge/Angular-17.0.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características Principales

### 🎯 Funcionalidades

- **🔍 Búsqueda de Facturas**: Formulario con validación para consultar facturas por ID de cliente. La tabla permanece oculta hasta realizar una búsqueda exitosa.
- **📊 Tabla de Facturas**: Visualización clara y responsiva de facturas con información detallada y estados diferenciados (pendiente, pagado, vencido).
- **💳 Modal de Pago**: Interfaz modal profesional procesada mediante **SweetAlert2** para confirmar y procesar pagos.
- **⚡ Actualización Reactiva**: La UI se actualiza inmediatamente después de procesar un pago sin necesidad de recargar la página.
- **🎨 Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- **♿ Accesibilidad**: Implementación de estándares ARIA y navegación por teclado

### 🏗️ Arquitectura

- **Componentes Modulares**: Separación clara de responsabilidades
  - `InvoiceListComponent`: Contenedor principal que orquesta la aplicación
  - `InvoiceSearchComponent`: Formulario de búsqueda de facturas
  - `InvoiceTableComponent`: Tabla de visualización de facturas
  - `InvoicePaymentComponent`: Modal de confirmación de pago
- **Servicios**: Lógica de negocio centralizada en `InvoiceService`
- **Modelos TypeScript**: Tipado estricto para garantizar seguridad de tipos
- **Mock API**: JSON Server para simular backend durante desarrollo

## 📋 Requisitos Previos

- **Node.js**: versión 18 o superior
- **npm**: versión 9 o superior
- **Angular CLI**: se instalará como dependencia del proyecto

## 🚀 Instalación Rápida

1. **Clonar o navegar al directorio del proyecto**:
   ```bash
   cd bill-payment
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Verificar la instalación**:
   ```bash
   ng version
   ```

## 🏃 Ejecución del Proyecto

### Modo Desarrollo

La aplicación requiere dos terminales para ejecutarse correctamente:

#### Terminal 1: Mock API
```bash
npm run mock:api
```
El servidor mock estará disponible en `http://localhost:3000`

#### Terminal 2: Servidor de Desarrollo
```bash
npm start
# o
ng serve
```
La aplicación estará disponible en `http://localhost:4200`

### Uso de la Aplicación

1. **Abrir en el navegador**: Navegar a `http://localhost:4200`

2. **Buscar Facturas**:
    - Ingresar un ID de cliente (8-10 caracteres numéricos según validación)
    - Ejemplos válidos: `100001`, `100010`, `200001`
   - Hacer clic en "Buscar"

3. **Revisar Facturas**:
   - La tabla muestra: Servicio, Período, Monto y Estado
   - Los montos se formatean como moneda mexicana (MXN)
   - Las facturas pendientes muestran el botón "Pagar" habilitado

4. **Pagar Factura**:
   - Hacer clic en "Pagar" en una factura pendiente
   - Revisar los detalles en el modal
   - Confirmar el pago
   - La factura se actualizará automáticamente a "Pagado"

### Build de Producción

```bash
npm run build:prod
```

Los archivos compilados se generarán en la carpeta `dist/bill-payment/` y estarán listos para desplegar.

## 📁 Estructura del Proyecto

```
bill-payment/
├── src/
│   ├── app/
│   │   ├── components/              # Componentes de la aplicación
│   │   │   ├── invoice-list/        # Contenedor principal
│   │   │   ├── invoice-search/      # Formulario de búsqueda
│   │   │   ├── invoice-table/       # Tabla de facturas
│   │   │   └── invoice-payment/     # Modal de pago
│   │   ├── services/                # Servicios Angular
│   │   │   └── invoice.service.ts   # Servicio de facturas
│   │   ├── models/                  # Interfaces y modelos
│   │   │   └── invoice.model.ts     # Modelo Invoice
│   │   ├── app.component.*         # Componente raíz
│   │   ├── app.module.ts            # Módulo principal
│   │   └── app-routing.module.ts    # Configuración de rutas
│   ├── assets/                      # Recursos estáticos
│   ├── mocks/                       # Datos mock para JSON Server
│   │   └── db.json                  # Base de datos mock
│   ├── styles.scss                  # Estilos globales
│   ├── index.html
│   └── main.ts
├── angular.json                     # Configuración Angular CLI
├── tsconfig.json                    # Configuración TypeScript
├── .eslintrc.json                   # Configuración ESLint
├── karma.conf.js                    # Configuración Karma
├── package.json
└── README.md
```

## 🔌 Mock API

El proyecto utiliza **JSON Server** para simular una API REST completa.

### Endpoints Disponibles

- `GET /invoices?customerId={id}` - Obtener facturas por ID de cliente
- `GET /invoices` - Obtener todas las facturas
- `PATCH /invoices/{id}` - Actualizar estado de factura (usado para pagos)

### Datos de Ejemplo

El archivo `src/mocks/db.json` incluye facturas de ejemplo:

- **Cliente `100001`**: 
  - Electricidad, Agua, Internet - Enero 2024 (todos pagados)
  - Electricidad, Agua, Internet - Febrero 2024 (todos pagados)
- **Cliente `100010`**: 
  - Electricidad - Noviembre 2025 (vencido)
  - Agua - Noviembre 2025 (pendiente)
- **Cliente `200014`**:
  - Electricidad - Junio 2025 (vencido)
  - Agua - Junio 2025 (pendiente)

### Comandos Mock API

```bash
# Desarrollo (con watch - recarga automática)
npm run mock:api

# Producción (sin watch)
npm run mock:api:prod
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Modo watch (desarrollo)
npm test

# Modo CI (sin watch)
npm run test:ci
```

### Cobertura de Tests

Los tests unitarios cubren:
- ✅ Componentes principales (`InvoiceListComponent`, `InvoicePaymentComponent`)
- ✅ Servicios (`InvoiceService`)
- ✅ Validaciones de formularios
- ✅ Manejo de errores

## 🔧 Herramientas de Desarrollo

### ESLint

Linter configurado con reglas de Angular y TypeScript:

```bash
# Verificar errores
npm run lint

# Corregir errores automáticamente
npm run lint:fix
```

### Prettier

Formateador de código para mantener consistencia:

```bash
# Formatear código
npm run format

# Verificar formato
npm run format:check
```

### TypeScript

- **Strict mode** habilitado
- Validaciones estrictas de templates
- Validaciones estrictas de inyección de dependencias

## 🎨 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Angular** | 17.0.0 | Framework principal |
| **TypeScript** | 5.2.2 | Lenguaje de programación |
| **RxJS** | 7.8.0 | Programación reactiva |
| **SCSS** | - | Preprocesador CSS |
| **JSON Server** | 0.17.4 | Mock API |
| **Karma/Jasmine** | - | Testing |
| **ESLint** | 8.54.0 | Linting |
| **Prettier** | 3.1.0 | Formateo de código |

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Compila para desarrollo |
| `npm run build:prod` | Compila para producción |
| `npm test` | Ejecuta tests en modo watch |
| `npm run test:ci` | Ejecuta tests en modo CI |
| `npm run lint` | Verifica código con ESLint |
| `npm run lint:fix` | Corrige errores de ESLint |
| `npm run format` | Formatea código con Prettier |
| `npm run mock:api` | Inicia mock API con watch |
| `npm run mock:api:prod` | Inicia mock API sin watch |

## 🎯 Flujo de Usuario

1. **Búsqueda**: Usuario ingresa ID de cliente y hace clic en "Buscar"
2. **Visualización**: Se muestran las facturas del cliente en una tabla
3. **Pago**: Usuario hace clic en "Pagar" en una factura pendiente
4. **Confirmación**: Se abre modal con detalles de la factura
5. **Procesamiento**: Usuario confirma el pago, se muestra spinner
6. **Actualización**: La factura se actualiza a "Pagado" automáticamente
7. **Feedback**: Mensaje de éxito y cierre automático del modal

## 🐛 Solución de Problemas

### El Mock API no responde

- Verificar que el puerto 3000 no esté en uso
- Asegurarse de que `json-server` esté instalado: `npm install`
- Verificar que el archivo `src/mocks/db.json` exista
- Reiniciar el servidor mock: `npm run mock:api`

### Errores de CORS

- El mock API debe estar ejecutándose en `http://localhost:3000`
- Verificar la URL en `src/app/services/invoice.service.ts`
- Asegurarse de que ambos servidores estén corriendo

### Problemas de compilación

```bash
# Limpiar caché y reinstalar
rm -rf node_modules .angular
npm install

# Verificar versión de Node.js
node --version  # Debe ser 18+
```

### Tests fallan

- Asegurarse de que todas las dependencias estén instaladas
- Verificar que el mock API esté corriendo para tests de integración
- Ejecutar `npm run lint` para verificar errores de código

## 📝 Convenciones de Código

### Commits

El proyecto sigue **Conventional Commits**:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `style:` Cambios de formato/estilo
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `docs:` Cambios en documentación
- `chore:` Tareas de mantenimiento

### Estructura de Componentes

Cada componente incluye:
- `.component.ts` - Lógica del componente
- `.component.html` - Template
- `.component.scss` - Estilos
- `.component.spec.ts` - Tests unitarios

## 🤝 Contribución

Este es un proyecto de ejemplo profesional. Para contribuir:

1. Crear una rama desde `main`
2. Realizar cambios siguiendo las convenciones
3. Agregar tests para nuevas funcionalidades
4. Seguir Conventional Commits
5. Crear un Pull Request con descripción clara

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia **MIT**.

## 🎉 Estado del Proyecto

✅ **Versión 1.0.0** - Lista para producción

- ✅ Componentes modulares implementados
- ✅ Funcionalidad de pago completa
- ✅ Tests unitarios básicos
- ✅ Documentación completa
- ✅ Build de producción funcional
- ✅ UI/UX profesional y responsiva
- ✅ Accesibilidad implementada

---

**Desarrollado con ❤️ usando Angular 17**
