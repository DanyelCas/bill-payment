# 🔌 Mock API (JSON Server)

El proyecto utiliza **JSON Server** para simular una API REST completa y persistente durante el desarrollo.

## 🏃 Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run mock:api` | Inicia servidor con recarga automática (puerto 3000) |
| `npm run mock:api:prod` | Inicia servidor sin recarga automática |

## 📡 Endpoints Disponibles

- `GET /users` - Lista de usuarios
- `GET /invoices` - Todas las facturas (Admin)
- `GET /invoices?customerId={id}` - Facturas por cliente (User)
- `POST /invoices` - Crear factura
- `PUT /invoices/{id}` - Modificar factura / Pagar
- `DELETE /invoices/{id}` - Eliminar factura
- `POST /receipts` - Registrar comprobante de pago

## 📊 Datos de Ejemplo

El archivo `src/mocks/db.json` incluye los siguientes perfiles para pruebas:

### Casos de Prueba:
- **Cliente `100001`**: Usuario "Juan Perez" con múltiples facturas pendientes y pagadas.
- **Cliente `100002`**: Usuario con deudas de servicios de gas domiciliario.
- **Admin**: Acceso mediante login especial (ver [AUTH.md](AUTH.md)).

## 🛠️ Solución de Problemas

- **Puerto en uso**: Si el puerto 3000 está ocupado, el servidor fallará. Verifica procesos con `netstat` o cambia el puerto en `package.json`.
- **Persistencia**: Cualquier `PATCH` realizado desde la aplicación modificará permanentemente el archivo `db.json` local.
