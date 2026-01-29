# 🔐 Autenticación y Seguridad

Sistema de acceso profesional con roles diferenciados para la gestión de facturas.

## 👥 Roles de Usuario

El sistema cuenta con dos niveles de acceso:

| Rol | Alcance | Destino |
|-----|---------|---------|
| **USER** | Consulta y pago de facturas personales | `/invoices` |
| **ADMIN** | Gestión administrativa global (Beta) | `/admin` |

## 🚀 Flujo de Acceso

1. **Pantalla de Login**: Ubicada en la raíz `/login`.
2. **Acceso Cliente**: Ingreso rápido mediante ID de cliente (8-10 dígitos).
3. **Acceso Admin**: Mediante el enlace "Iniciar sesión como administrador" en el footer de la tarjeta de login.

### Credenciales de Administrador (Mock)
- **Usuario**: `admin`
- **Contraseña**: `password123`

## 🛡️ Protección de Rutas (Guards)

- **AuthGuard**: Verifica que el usuario tenga una sesión activa. Si no, redirige a `/login`.
- **RoleGuard**: Verifica que el rol del usuario coincida con el requerido por la ruta (`data: { role: UserRole.ADMIN }`).
- **GuestGuard**: Protege la ruta `/login`. Si el usuario ya está autenticado, evita que vea el formulario de login y lo redirige a su dashboard correspondiente.

## 💾 Persistencia
La sesión se almacena de forma segura en `localStorage` bajo la clave `currentUser`. Esto permite que la sesión persista tras recargar la página. Para cerrar sesión, se debe invocar el método `logout()` del `AuthService`.
