# 🏗️ Arquitectura y Estructura

Detalles técnicos sobre la organización y patrones utilizados en el proyecto **Bill Payment**.

## 📁 Estructura del Proyecto

```
bill-payment/
├── src/
│   ├── app/
│   │   ├── components/              # Componentes de la aplicación
│   │   │   ├── invoice-list/        # Contenedor principal
│   │   │   ├── invoice-search/      # Formulario de búsqueda
│   │   │   ├── invoice-table/       # Tabla de facturas
│   │   │   ├── invoice-payment/     # Modal de pago
│   │   │   ├── login/               # Pantalla de acceso
│   │   │   └── admin-dashboard/     # Panel administrativo (Beta)
│   │   ├── services/                # Lógica de negocio y API
│   │   │   ├── invoice.service.ts   # Gestión de facturas
│   │   │   └── auth.service.ts      # Gestión de sesión
│   │   ├── guards/                  # Protección de rutas
│   │   │   ├── auth.guard.ts        # Control de autenticación
│   │   │   └── role.guard.ts        # Control de roles (ADMIN/USER)
│   │   ├── models/                  # Interfaces y modelos
│   │   │   ├── invoice.model.ts     # Modelo de Factura
│   │   │   └── user.model.ts        # Modelo de Usuario y Roles
│   │   ├── app.component.*         # Componente raíz
│   │   ├── app.module.ts            # Módulo principal
│   │   └── app-routing.module.ts    # Configuración de rutas
│   ├── assets/                      # Recursos estáticos
│   ├── mocks/                       # Datos mock para JSON Server
│   │   └── db.json                  # Base de datos mock
│   ├── styles.scss                  # Estilos globales
│   ├── index.html
│   └── main.ts
├── docs/                            # Documentación detallada
└── angular.json                     # Configuración Angular CLI
```

## 🏗️ Patrones de Diseño

- **Componentes Modulares**: Cada funcionalidad reside en su propio componente con estilos y lógica encapsulada.
- **Servicios Centralizados**: La comunicación con la API y el estado compartido se manejan exclusivamente a través de servicios inyectables.
- **Type Safety**: Uso estricto de interfaces TypeScript para garantizar la integridad de los datos en toda la aplicación.
- **Reactive Programming**: Uso de RxJS para el manejo de flujos asíncronos y actualización de la UI.

## 📝 Convenciones de Código

### Commits
Seguimos **Conventional Commits**:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato/estilo
- `refactor:` Refactorización de código

### Componentes
Cada componente debe incluir:
- `.component.ts` - Lógica
- `.component.html` - Template
- `.component.scss` - Estilos
- `.component.spec.ts` - Tests unitarios
