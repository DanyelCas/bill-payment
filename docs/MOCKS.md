# 🔌 Mock API (JSON Server)

El proyecto utiliza **JSON Server** para simular una API REST completa y persistente durante el desarrollo.

## 🏃 Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run mock:api` | Inicia servidor con recarga automática (puerto 3000) |
| `npm run mock:api:prod` | Inicia servidor sin recarga automática |

## 📡 Endpoints Disponibles

- `GET /invoices?customerId={id}` - Obtener facturas por ID de cliente
- `GET /invoices` - Obtener todas las facturas
- `PATCH /invoices/{id}` - Actualizar estado de factura (usado para pagos)

## 📊 Datos de Ejemplo

El archivo `src/mocks/db.json` incluye diversos escenarios de prueba:

### Casos de Prueba Recomendados:
- **Cliente `100001`**: Historial limpio (todas las facturas pagadas).
- **Cliente `100010`**: Facturas mixtas (Pendientes y Vencidas).
- **Cliente `200014`**: Facturas con montos altos para pruebas de UI.

## 🛠️ Solución de Problemas

- **Puerto en uso**: Si el puerto 3000 está ocupado, el servidor fallará. Verifica procesos con `netstat` o cambia el puerto en `package.json`.
- **Persistencia**: Cualquier `PATCH` realizado desde la aplicación modificará permanentemente el archivo `db.json` local.
