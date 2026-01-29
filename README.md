# Bill Payment - Sistema de Pago de Servicios

Single Page Application (SPA) construida con Angular para simular un flujo de trabajo empresarial de pago de facturas de servicios públicos. Los usuarios pueden consultar facturas pendientes por ID de cliente, revisar detalles de facturación y completar pagos utilizando un mock API.

## 🚀 Características

- **Formulario de consulta**: Validación de ID de cliente con formato alfanumérico
- **Tabla de facturas**: Visualización de facturas pendientes con información detallada
- **Mock API**: Servidor JSON simulado para desarrollo sin backend real
- **Arquitectura limpia**: Separación de componentes, servicios y modelos
- **TypeScript strict mode**: Código type-safe con validaciones estrictas
- **Testing**: Configuración base con Karma/Jasmine

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Angular CLI (se instalará como dependencia)

## 🛠️ Instalación

1. **Clonar el repositorio** (si aplica) o navegar al directorio del proyecto:
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

### Desarrollo

1. **Iniciar el Mock API** (en una terminal separada):
   ```bash
   npm run mock:api
   ```
   El servidor mock estará disponible en `http://localhost:3000`

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   # o
   ng serve
   ```
   La aplicación estará disponible en `http://localhost:4200`

3. **Abrir en el navegador**:
   - Navegar a `http://localhost:4200`
   - Ingresar un ID de cliente (ej: `CUST001` o `CUST002`)
   - Ver las facturas pendientes

### Build de Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/bill-payment`.

## 📁 Estructura del Proyecto

```
bill-payment/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes de la aplicación
│   │   │   └── invoice-list/   # Componente principal de listado
│   │   ├── services/            # Servicios Angular
│   │   │   └── invoice.service.ts
│   │   ├── models/              # Interfaces y modelos TypeScript
│   │   │   └── invoice.model.ts
│   │   ├── app.component.*      # Componente raíz
│   │   ├── app.module.ts        # Módulo principal
│   │   └── app-routing.module.ts
│   ├── assets/                  # Recursos estáticos
│   ├── mocks/                   # Datos mock para JSON Server
│   │   └── db.json
│   ├── styles.scss              # Estilos globales
│   ├── index.html
│   └── main.ts
├── angular.json                 # Configuración de Angular CLI
├── tsconfig.json               # Configuración TypeScript (strict mode)
├── .eslintrc.json              # Configuración ESLint
├── .prettierrc                 # Configuración Prettier
├── karma.conf.js               # Configuración Karma para testing
└── package.json
```

## 🔌 Mock API

El proyecto utiliza **JSON Server** para simular una API REST. Los datos se encuentran en `src/mocks/db.json`.

### Endpoints Disponibles

- `GET /invoices?customerId={id}` - Obtener facturas por ID de cliente
- `GET /invoices` - Obtener todas las facturas

### Datos de Ejemplo

El archivo `db.json` incluye facturas de ejemplo para los siguientes clientes:
- **CUST001**: 2 facturas (Electricidad, Agua)
- **CUST002**: 2 facturas (Internet, Telefonía)

### Ejecutar Mock API

```bash
# Desarrollo (con watch)
npm run mock:api

# Producción (sin watch)
npm run mock:api:prod
```

## 🧪 Testing

Ejecutar los tests unitarios:

```bash
npm test
# o
ng test
```

Los tests utilizan Karma como test runner y Jasmine como framework de testing.

## 🔧 Herramientas de Desarrollo

### ESLint

Linter configurado con reglas de Angular y TypeScript:

```bash
npm run lint
```

### Prettier

Formateador de código configurado:

```bash
# Formatear código (requiere prettier CLI instalado globalmente)
npx prettier --write "src/**/*.{ts,html,scss}"
```

### TypeScript

- **Strict mode** habilitado
- Validaciones estrictas de templates
- Validaciones estrictas de inyección de dependencias

## 📝 Uso de la Aplicación

1. **Ingresar ID de Cliente**:
   - El campo acepta valores alfanuméricos de 6 a 12 caracteres
   - Ejemplos válidos: `CUST001`, `CUST002`, `ABC123456`

2. **Consultar Facturas**:
   - Hacer clic en "Buscar Facturas"
   - Se mostrarán las facturas pendientes del cliente

3. **Revisar Información**:
   - La tabla muestra: Servicio, Período, Monto y Estado
   - Los montos se formatean como moneda mexicana (MXN)

4. **Pago**:
   - El botón de pago está deshabilitado (funcionalidad pendiente)

## 🎨 Tecnologías Utilizadas

- **Angular 17**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **SCSS**: Preprocesador CSS
- **JSON Server**: Mock API
- **Karma/Jasmine**: Testing
- **ESLint**: Linting
- **Prettier**: Formateo de código

## 📦 Scripts Disponibles

- `npm start` / `ng serve` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm test` / `ng test` - Ejecuta los tests unitarios
- `npm run lint` - Ejecuta el linter
- `npm run mock:api` - Inicia el mock API con watch
- `npm run mock:api:prod` - Inicia el mock API sin watch

## 🤝 Contribución

Este es un proyecto de ejemplo. Para contribuir:

1. Crear una rama desde `main`
2. Realizar cambios
3. Seguir Conventional Commits para los mensajes
4. Crear un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🐛 Solución de Problemas

### El Mock API no responde

- Verificar que el puerto 3000 no esté en uso
- Asegurarse de que `json-server` esté instalado: `npm install`
- Verificar que el archivo `src/mocks/db.json` exista

### Errores de CORS

- El mock API debe estar ejecutándose en `http://localhost:3000`
- Verificar la URL en `invoice.service.ts`

### Problemas de compilación

- Limpiar caché: `rm -rf node_modules .angular && npm install`
- Verificar versión de Node.js: `node --version` (debe ser 18+)
