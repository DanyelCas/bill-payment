# 🏗️ Arquitectura y Estructura

Detalles técnicos sobre la organización y patrones utilizados en el proyecto **Bill Payment**.

## 📁 Estructura del Proyecto

```
bill-payment/
├── src/
│   ├── app/
│   │   ├── components/              # Componentes de la aplicación
│   │   │   ├── auth/                # Login y procesos de cuenta
│   │   │   ├── user/                # Vistas de Cliente Final
│   │   │   │   ├── dashboard/       # Métricas y resumen
│   │   │   │   ├── invoices/        # Listado y pago
│   │   │   │   └── receipts/        # Buscador de recibos
│   │   │   ├── admin/               # Panel Administrativo
│   │   │   │   ├── admin-dashboard/
│   │   │   │   ├── admin-users/     # Gestión de usuarios
│   │   │   │   └── admin-invoices/  # Gestión de facturas
│   │   │   └── shared/              # UI Components (Table, Dropdown, etc.)
│   │   ├── services/                # Lógica de negocio y API
│   │   │   ├── invoice.service.ts   # Gestión de facturas
│   │   │   ├── auth.service.ts      # Gestión de sesión
│   │   │   └── user.service.ts      # Gestión de usuarios
│   │   ├── guards/                  # Protección de rutas
│   │   ├── models/                  # Interfaces y modelos
│   │   ├── app.module.ts            # Módulo principal
│   │   └── app-routing.module.ts    # Configuración de rutas
│   ├── mocks/                       # Datos mock para JSON Server
│   │   └── db.json                  # Base de datos local
│   └── main.ts
├── docs/                            # Documentación detallada
│   └── diagrams/                    # Diagramas Mermaid (Arquitectura, etc.)
└── angular.json                     # Configuración Angular CLI
```

## 📊 Diagramas de Referencia

Para una visión gráfica del sistema, consulta:
- [Arquitectura de Alto Nivel](diagrams/architecture.md)
- [Estructura de Componentes](diagrams/components.md)
- [Flujo de Secuencia (Pago)](diagrams/sequence.md)
- [Estrategia de Despliegue](diagrams/deployment.md)

## 🏗️ Patrones de Diseño

- **Arquitectura de Servicios**: Toda la lógica de negocio y comunicación HTTP está aislada en servicios inyectables.
- **Componentes Basados en Roles**: Las vistas están segregadas por carpetas `user/` y `admin/` para claridad estructural.
- **Data-Driven UI**: Los formularios (especialmente en Admin) utilizan `ReactiveFormsModule` para validaciones dinámicas.
- **Estado Persistente Local**: Uso de `LocalStorage` para mantener sesiones sin backend de tokens real.

## 📝 Convenciones de Código

### Commits
Seguimos **Conventional Commits**:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios visuales/SCSS
- `refactor:` Mejora de código existente

### Componentes
Mantenemos el estándar de Angular: logic (`.ts`), template (`.html`), style (`.scss`), and testing (`.spec.ts`).
