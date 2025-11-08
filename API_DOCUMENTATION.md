# 📚 Documentación del API - Sistema de Administración Ganadera

## 🔐 Autenticación

Todas las rutas (excepto `/api/auth/login` y `/api/auth/register`) requieren autenticación mediante JWT.

### Credenciales por Defecto

```
Email: admin@ganaderia.com
Password: admin123
```

### Cómo usar el Token

Una vez que obtengas el token del login, debes incluirlo en todas las peticiones protegidas:

```
Authorization: Bearer {tu_token_aqui}
```

O alternativamente:

```
x-access-token: {tu_token_aqui}
```

---

## 📋 Endpoints Disponibles

### 🔓 Autenticación (Rutas Públicas)

#### POST `/api/auth/login`
Iniciar sesión

**Body:**
```json
{
  "email": "admin@ganaderia.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@ganaderia.com",
      "activo": true,
      "rol_id": 1,
      "rol_nombre": "admin",
      "fecha_creacion": "21/10/2025 14:47:20"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

#### POST `/api/auth/register`
Registrar nuevo usuario

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol_id": 3
}
```

### 🔒 Perfil de Usuario (Protegido)

#### GET `/api/auth/profile`
Obtener perfil del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

#### PUT `/api/auth/change-password`
Cambiar contraseña

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "currentPassword": "password_actual",
  "newPassword": "password_nueva"
}
```

---

## 👥 Gestión de Usuarios

### GET `/api/usuarios`
Obtener todos los usuarios

### GET `/api/usuarios/:id`
Obtener usuario por ID

### POST `/api/usuarios` (Solo Admin)
Crear nuevo usuario

**Body:**
```json
{
  "nombre": "María García",
  "email": "maria@example.com",
  "password": "password123",
  "rol_id": 2,
  "activo": true
}
```

### PUT `/api/usuarios/:id` (Solo Admin)
Actualizar usuario

### DELETE `/api/usuarios/:id` (Solo Admin)
Desactivar usuario

### GET `/api/usuarios/roles`
Obtener todos los roles disponibles

---

## 🐄 Gestión de Ganado

### GET `/api/ganado`
Obtener todo el ganado

**Respuesta:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "rfid": "RFID001",
      "nombre": "Vaca Lola",
      "fecha_nacimiento": "15/03/2020",
      "raza": "Holstein",
      "estado": "activo",
      "fecha_registro": "21/10/2025 10:30:00"
    }
  ]
}
```

### GET `/api/ganado/:id`
Obtener ganado por ID

### POST `/api/ganado`
Crear nuevo registro de ganado

**Body:**
```json
{
  "rfid": "RFID002",
  "nombre": "Vaca Clarita",
  "fecha_nacimiento": "10/05/2021",
  "raza": "Jersey",
  "estado": "activo"
}
```

### PUT `/api/ganado/:id`
Actualizar registro de ganado

### DELETE `/api/ganado/:id`
Eliminar registro de ganado

---

## 🏥 Salud del Ganado

### GET `/api/salud-ganado`
Obtener todos los registros de salud

### GET `/api/salud-ganado/:id`
Obtener registro por ID

### POST `/api/salud-ganado`
Crear registro de salud

**Body:**
```json
{
  "ganado_id": 1,
  "temperatura": 38.5,
  "comportamiento": "Normal, comiendo bien",
  "observaciones": "Sin novedades"
}
```

### PUT `/api/salud-ganado/:id`
Actualizar registro

### DELETE `/api/salud-ganado/:id`
Eliminar registro

---

## 🥛 Producción de Leche

### GET `/api/produccion-leche`
Obtener todos los registros de producción

### GET `/api/produccion-leche/:id`
Obtener registro por ID

### POST `/api/produccion-leche`
Crear registro de producción

**Body:**
```json
{
  "ganado_id": 1,
  "cantidad_leche": 25.5,
  "calidad_leche": 3.8,
  "fecha_oreno": "21/10/2025 06:00:00"
}
```

### PUT `/api/produccion-leche/:id`
Actualizar registro

### DELETE `/api/produccion-leche/:id`
Eliminar registro

---

## 📦 Gestión de Inventarios

### GET `/api/inventarios`
Obtener todos los inventarios

### GET `/api/inventarios/:id`
Obtener inventario por ID

### POST `/api/inventarios`
Crear inventario

**Body:**
```json
{
  "nombre_producto": "Alimento para ganado",
  "cantidad": 1000,
  "unidad": "kg",
  "precio_unitario": 15.50,
  "categoria_id": 1
}
```

### PUT `/api/inventarios/:id`
Actualizar inventario

### DELETE `/api/inventarios/:id`
Eliminar inventario

---

## 🏷️ Categorías de Inventario

### GET `/api/categorias-inventario`
Obtener todas las categorías

### POST `/api/categorias-inventario`
Crear categoría

**Body:**
```json
{
  "categoria_nombre": "Alimentos"
}
```

### PUT `/api/categorias-inventario/:id`
Actualizar categoría

### DELETE `/api/categorias-inventario/:id`
Eliminar categoría

---

## 👷 Gestión de Empleados

### GET `/api/empleados`
Obtener todos los empleados

### GET `/api/empleados/:id`
Obtener empleado por ID

### POST `/api/empleados`
Crear empleado

**Body:**
```json
{
  "nombre_empleado": "Carlos Rodríguez",
  "puesto": "Ordeñador",
  "fecha_nacimiento": "15/06/1985",
  "telefono": "5551234567",
  "correo": "carlos@example.com",
  "estado": "activo"
}
```

### PUT `/api/empleados/:id`
Actualizar empleado

### DELETE `/api/empleados/:id`
Eliminar empleado

---

## 📋 Gestión de Personal

### GET `/api/gestion-personal`
Obtener todas las tareas asignadas

### GET `/api/gestion-personal/:id`
Obtener tarea por ID

### POST `/api/gestion-personal`
Asignar tarea

**Body:**
```json
{
  "empleado_id": 1,
  "tarea": "Ordeño matutino",
  "fecha_asignacion": "21/10/2025 06:00:00",
  "fecha_finalizacion": null,
  "estado": "en_progreso"
}
```

### PUT `/api/gestion-personal/:id`
Actualizar tarea

### DELETE `/api/gestion-personal/:id`
Eliminar tarea

---

## 💰 Gestión de Ventas

### GET `/api/ventas`
Obtener todas las ventas

### GET `/api/ventas/:id`
Obtener venta por ID

### POST `/api/ventas`
Registrar venta

**Body:**
```json
{
  "producto": "Leche fresca",
  "cantidad": 50.0,
  "precio_unitario": 25.00,
  "cliente_nombre": "Lácteos del Valle",
  "cliente_direccion": "Av. Principal 123"
}
```

### PUT `/api/ventas/:id`
Actualizar venta

### DELETE `/api/ventas/:id`
Eliminar venta

---

## 🧾 Facturación

### GET `/api/facturacion`
Obtener todas las facturas

### GET `/api/facturacion/:id`
Obtener factura por ID

### POST `/api/facturacion`
Crear factura

**Body:**
```json
{
  "venta_id": 1,
  "numero_factura": "FAC-001-2025",
  "monto_total": 1250.00
}
```

### PUT `/api/facturacion/:id`
Actualizar factura

### DELETE `/api/facturacion/:id`
Eliminar factura

---

## 📊 Producción Diaria

### GET `/api/produccion-diaria`
Obtener registros de producción diaria

### POST `/api/produccion-diaria`
Registrar producción diaria

**Body:**
```json
{
  "ganado_id": 1,
  "fecha": "21/10/2025",
  "cantidad_leche": 18.5
}
```

---

## 🚨 Alertas

### GET `/api/alertas`
Obtener todas las alertas

### POST `/api/alertas`
Crear alerta

**Body:**
```json
{
  "tipo_alerta": "Salud",
  "mensaje": "Vaca con temperatura elevada"
}
```

---

## 📈 Históricos

### Histórico de Salud

#### GET `/api/historico-salud`
Obtener histórico de salud

#### POST `/api/historico-salud`
```json
{
  "ganado_id": 1,
  "estado_salud": "Enfermo",
  "observaciones": "Tratamiento antibiótico",
  "fecha_inicio": "20/10/2025 10:00:00",
  "fecha_fin": "22/10/2025 10:00:00"
}
```

### Histórico de Producción

#### GET `/api/historico-produccion`
Obtener histórico de producción

#### POST `/api/historico-produccion`
```json
{
  "ganado_id": 1,
  "cantidad_leche": 150.0,
  "fecha_inicio": "01/10/2025",
  "fecha_fin": "07/10/2025"
}
```

---

## 🧪 Endpoints de Prueba

### GET `/health`
Estado del servidor (público)

### GET `/api/dates/datetime`
Probar formatos de fecha en Node.js (público)

### GET `/api/dates/db-datetime`
Probar formatos de fecha en PostgreSQL (público)

---

## 📝 Códigos de Respuesta

- `200` - OK: Solicitud exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Datos inválidos
- `401` - Unauthorized: Token inválido o expirado
- `403` - Forbidden: No tienes permisos
- `404` - Not Found: Recurso no encontrado
- `500` - Internal Server Error: Error del servidor

---

## 🔑 Roles Disponibles

1. **admin** - Administrador con acceso completo
2. **supervisor** - Supervisor con la mayoría de permisos
3. **empleado** - Empleado con acceso limitado
4. **veterinario** - Veterinario con acceso a salud

---

## 🌐 URL Base

**Desarrollo:**
```
http://localhost:3000
```

**Ejemplo de uso con curl:**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ganaderia.com","password":"admin123"}'

# Obtener ganado (con token)
curl -X GET http://localhost:3000/api/ganado \
  -H "Authorization: Bearer {tu_token}"
```

---

## 📅 Formato de Fechas

Todas las fechas se manejan en formato **DD/MM/YYYY** y hora en **formato 24 horas (HH:MM:SS)**.

**Ejemplo:**
- Fecha: `21/10/2025`
- Hora: `14:30:45`
- Fecha y hora: `21/10/2025 14:30:45`

**Zona horaria:** America/Mexico_City (GMT-6)
