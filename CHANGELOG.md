# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### ✨ Agregado
- Componente `InvoiceListComponent` como contenedor principal
- Componente `InvoiceSearchComponent` para búsqueda de facturas por ID de cliente
- Componente `InvoiceTableComponent` para visualización de facturas en tabla
- Componente `InvoicePaymentComponent` modal para confirmación y procesamiento de pagos
- Servicio `InvoiceService` con métodos `getInvoices()` y `payInvoice()`
- Modelo `Invoice` con tipado estricto TypeScript
- Mock API con JSON Server y datos de ejemplo
- Validación de formularios con mensajes de error claros
- Estados de UI: loading, error, vacío, éxito
- Diseño responsivo para mobile y desktop
- Accesibilidad: roles ARIA, navegación por teclado, contraste adecuado
- Tests unitarios para componentes principales
- Documentación completa en README.md

### 🎨 Mejoras
- Separación modular de componentes
- Actualización reactiva de UI después de pagos
- Animaciones y transiciones suaves
- Feedback visual claro para todas las acciones
- Formateo de moneda mexicana (MXN)

### 🔧 Configuración
- ESLint configurado con reglas de Angular
- Prettier para formateo de código
- TypeScript strict mode habilitado
- Scripts de build para desarrollo y producción
- Scripts de testing y linting

### 📝 Documentación
- README completo con instrucciones de instalación y uso
- Documentación de estructura del proyecto
- Guía de solución de problemas
- Convenciones de código y commits

---

## [Unreleased]

### Planificado
- Filtros adicionales para facturas
- Historial de pagos
- Exportación de facturas
- Notificaciones push
- Autenticación de usuarios
