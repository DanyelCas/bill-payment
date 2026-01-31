# 💳 Bill Payment - Sistema de Pago de Servicios

Single Page Application (SPA) profesional construida con **Angular 17** para gestionar el pago de facturas de servicios públicos.

![Angular](https://img.shields.io/badge/Angular-17.0.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Características Principales

### 👥 Portal de Usuario (Cliente)
- **📊 Dashboard Interactivo**: Visualización de métricas de gasto mensual y promedio mediante gráficos dinámicos (`ngx-charts`).
- **📑 Gestión de Facturas**: Consulta detallada de deudas pendientes, pagadas y vencidas con filtros avanzados.
- **💳 Pasarela de Pago Simulada**: Flujo completo de pago con validaciones y confirmaciones visuales (`SweetAlert2`).
- **🧾 Comprobantes Digitales**: Generación automática de recibos en formato **PDF** (`jsPDF`) tras cada pago exitoso.
- **🔍 Historial de Recibos**: Buscador dedicado para recuperar y descargar comprobantes de pagos anteriores.

### 🛡️ Panel de Administración
- **📈 Métricas Globales**: Resumen ejecutivo del estado de facturación y usuarios en el sistema.
- **👥 Gestión de Usuarios**: Control total (CRUD) sobre la base de datos de clientes, permitiendo gestionar accesos y perfiles.
- **✍️ Control de Facturación**: Herramientas integrales para crear nuevas facturas, editar montos o corregir datos de deudas existentes.
- **🧹 Gestión de Deudas**: Capacidad para anular o eliminar registros de facturación según requerimientos administrativos.

### ⚙️ Características Técnicas
- **🔐 Seguridad Multi-Rol**: Protección de rutas mediante `Guards` de Angular, separando estrictamente las áreas de Usuario y Admin.
- **💾 Sesión Persistente**: Manejo de estado de sesión mediante `LocalStorage` para garantizar la continuidad del trabajo.
- **📱 Interfaz Adaptive**: Diseño moderno y responsivo utilizando **SCSS** avanzado, adaptable a móviles, tablets y escritorio.
- **🛠️ Arquitectura Robusta**: Código altamente tipado con **TypeScript**, siguiendo las mejores prácticas de modularización de Angular.
- **🔌 Mock Backend**: Entorno de desarrollo desacoplado utilizando una API REST simulada con persistencia real en archivo JSON.

---

## 🚀 Inicio Rápido

### 1. Instalación
```bash
git clone https://github.com/DanyelCas/bill-payment.git
cd bill-payment
npm install
```

### 2. Ejecución (Requiere 2 terminales)

**Terminal 1 (API Mock):**
```bash
npm run mock:api
```

**Terminal 2 (App):**
```bash
npm start
```
Acceso en: `http://localhost:4200`

---

## 📚 Explorar Documentación Detallada

Para profundizar en el funcionamiento del sistema, consulta los siguientes manuales:

- [🔐 **Guía de Autenticación**](docs/AUTH.md): Roles, credenciales y flujo de acceso.
- [🔌 **Manual de Mock API**](docs/MOCKS.md): Endpoints, datos de prueba y solución de problemas.
- [🏗️ **Arquitectura y Estructura**](docs/ARCHITECTURE.md): Organización del código y convenciones técnicas.
- [📊 **Diagramas del Sistema**](docs/diagrams): Visualización de arquitectura, componentes y flujos.

---

## 🛠️ Tecnologías

| Tecnología | Propósito |
|------------|-----------|
| **Angular 17** | Framework SPA |
| **RxJS** | Estado reactivo |
| **SCSS** | Estilos avanzados |
| **JSON Server** | API de desarrollo |

---

**Desarrollado con ❤️ usando Angular 17**
