# 📚 Guía de Uso de la API - Sistema de Administración Ganadera

## 🌐 URL Base
```
http://localhost:3000
```

## 🔑 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para la autenticación. La mayoría de los endpoints requieren un token de acceso.

### Cómo obtener un token:
1. Hacer login con credenciales válidas
2. Copiar el token de la respuesta
3. Incluir el token en el header `Authorization: Bearer <tu-token>` en las siguientes peticiones

---

## 📋 Índice de Endpoints

1. [Autenticación](#-autenticación)
2. [Usuarios](#-usuarios)
3. [Ganado](#-ganado)
4. [Salud del Ganado](#-salud-del-ganado)
5. [Producción de Leche](#-producción-de-leche)
6. [Producción Diaria](#-producción-diaria)
7. [Histórico de Salud](#-histórico-de-salud)
8. [Histórico de Producción](#-histórico-de-producción)
9. [Inventarios](#-inventarios)
10. [Categorías de Inventario](#-categorías-de-inventario)
11. [Empleados](#-empleados)
12. [Gestión de Personal](#-gestión-de-personal)
13. [Ventas](#-ventas)
14. [Facturación](#-facturación)
15. [Alertas](#-alertas)

---

## 🔐 Autenticación

### 🔓 Login (Público)
Permite iniciar sesión y obtener un token JWT.

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "admin@ganaderia.com",
  "password": "admin123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@ganaderia.com",
    "rol": "admin"
  }
}
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ganaderia.com",
    "password": "admin123"
  }'
```

---

### 📝 Registro (Público)
Permite registrar un nuevo usuario.

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "1234567890",
  "rol_id": 3
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 5,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "empleado"
  }
}
```

---

### 👤 Obtener Perfil (Protegido)
Obtiene la información del usuario autenticado.

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <tu-token>
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@ganaderia.com",
    "rol": "admin",
    "telefono": null,
    "activo": true
  }
}
```

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <tu-token>"
```

---

### 🔒 Cambiar Contraseña (Protegido)
Permite cambiar la contraseña del usuario autenticado.

**Endpoint:** `PUT /api/auth/change-password`

**Headers:**
```
Authorization: Bearer <tu-token>
```

**Body:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "nuevaPassword456"
}
```

---

## 👥 Usuarios

### 📋 Listar Todos los Usuarios (Protegido)
**Endpoint:** `GET /api/usuarios`

**Headers:**
```
Authorization: Bearer <tu-token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@ganaderia.com",
      "rol": "admin",
      "telefono": null,
      "activo": true,
      "fecha_creacion": "21/10/2025 16:58:21"
    }
  ]
}
```

---

### 🔍 Obtener Usuario por ID (Protegido)
**Endpoint:** `GET /api/usuarios/:id`

**Ejemplo:** `GET /api/usuarios/1`

---

### ➕ Crear Usuario (Solo Admin)
**Endpoint:** `POST /api/usuarios`

**Headers:**
```
Authorization: Bearer <tu-token-admin>
```

**Body:**
```json
{
  "nombre": "María González",
  "email": "maria@ganaderia.com",
  "password": "password123",
  "telefono": "9876543210",
  "rol_id": 2
}
```

---

### ✏️ Actualizar Usuario (Solo Admin)
**Endpoint:** `PUT /api/usuarios/:id`

**Body:**
```json
{
  "nombre": "María González Actualizada",
  "telefono": "1111111111",
  "activo": true
}
```

---

### 🗑️ Eliminar Usuario (Solo Admin)
**Endpoint:** `DELETE /api/usuarios/:id`

**Ejemplo:** `DELETE /api/usuarios/5`

---

### 📜 Obtener Roles (Protegido)
**Endpoint:** `GET /api/usuarios/roles`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "nombre": "admin", "descripcion": "Administrador con acceso completo al sistema"},
    {"id": 2, "nombre": "supervisor", "descripcion": "Supervisor con permisos de gestión"},
    {"id": 3, "nombre": "empleado", "descripcion": "Empleado con acceso básico"},
    {"id": 4, "nombre": "veterinario", "descripcion": "Veterinario con acceso a salud del ganado"}
  ]
}
```

---

## 🐄 Ganado

### 📋 Listar Todo el Ganado (Protegido)
**Endpoint:** `GET /api/ganado`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Vaca Luna",
      "raza": "Holstein",
      "sexo": "Hembra",
      "fecha_nacimiento": "15/03/2020",
      "peso": 450.5,
      "estado": "Activo",
      "fecha_registro": "21/10/2025 16:58:21"
    }
  ]
}
```

---

### 🔍 Obtener Ganado por ID (Protegido)
**Endpoint:** `GET /api/ganado/:id`

---

### ➕ Crear Registro de Ganado (Protegido)
**Endpoint:** `POST /api/ganado`

**Body:**
```json
{
  "nombre": "Toro Bravo",
  "raza": "Brahman",
  "sexo": "Macho",
  "fecha_nacimiento": "2021-05-20",
  "peso": 600.0,
  "estado": "Activo"
}
```

---

### ✏️ Actualizar Ganado (Protegido)
**Endpoint:** `PUT /api/ganado/:id`

**Body:**
```json
{
  "peso": 650.0,
  "estado": "Activo"
}
```

---

### 🗑️ Eliminar Ganado (Protegido)
**Endpoint:** `DELETE /api/ganado/:id`

---

## 🏥 Salud del Ganado

### 📋 Listar Registros de Salud (Protegido)
**Endpoint:** `GET /api/salud-ganado`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ganado_id": 1,
      "nombre_ganado": "Vaca Luna",
      "tipo_tratamiento": "Vacunación",
      "descripcion": "Vacuna contra brucelosis",
      "fecha_tratamiento": "21/10/2025 10:00:00",
      "veterinario": "Dr. Martínez",
      "fecha_registro": "21/10/2025 16:58:21"
    }
  ]
}
```

---

### ➕ Crear Registro de Salud (Protegido)
**Endpoint:** `POST /api/salud-ganado`

**Body:**
```json
{
  "ganado_id": 1,
  "tipo_tratamiento": "Desparasitación",
  "descripcion": "Desparasitante interno",
  "fecha_tratamiento": "2025-10-21T14:30:00",
  "veterinario": "Dr. López"
}
```

---

## 🥛 Producción de Leche

### 📋 Listar Producción de Leche (Protegido)
**Endpoint:** `GET /api/produccion-leche`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ganado_id": 1,
      "nombre_ganado": "Vaca Luna",
      "cantidad": 25.5,
      "calidad": "A",
      "observaciones": "Buena producción",
      "fecha_oreno": "21/10/2025 06:00:00"
    }
  ]
}
```

---

### ➕ Registrar Producción de Leche (Protegido)
**Endpoint:** `POST /api/produccion-leche`

**Body:**
```json
{
  "ganado_id": 1,
  "cantidad": 28.0,
  "calidad": "A",
  "observaciones": "Excelente calidad",
  "fecha_oreno": "2025-10-21T06:00:00"
}
```

---

## 📊 Producción Diaria

### 📋 Listar Producción Diaria (Protegido)
**Endpoint:** `GET /api/produccion-diaria`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ganado_id": 1,
      "nombre_ganado": "Vaca Luna",
      "fecha": "21/10/2025",
      "cantidad_leche": 25.5
    }
  ]
}
```

---

### ➕ Registrar Producción Diaria (Protegido)
**Endpoint:** `POST /api/produccion-diaria`

**Body:**
```json
{
  "ganado_id": 1,
  "fecha": "2025-10-21",
  "cantidad_leche": 27.0
}
```

---

## 📜 Histórico de Salud

### 📋 Listar Histórico de Salud (Protegido)
**Endpoint:** `GET /api/historico-salud`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ganado_id": 1,
      "nombre_ganado": "Vaca Luna",
      "enfermedad": "Mastitis",
      "tratamiento": "Antibióticos",
      "fecha_inicio": "15/10/2025",
      "fecha_fin": "21/10/2025"
    }
  ]
}
```

---

## 📈 Histórico de Producción

### 📋 Listar Histórico de Producción (Protegido)
**Endpoint:** `GET /api/historico-produccion`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ganado_id": 1,
      "nombre_ganado": "Vaca Luna",
      "fecha": "21/10/2025",
      "cantidad_leche": 25.5,
      "calidad": "A"
    }
  ]
}
```

---

## 📦 Inventarios

### 📋 Listar Inventarios (Protegido)
**Endpoint:** `GET /api/inventarios`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre_producto": "Alimento Balanceado",
      "categoria": "Alimentos",
      "cantidad": 500,
      "unidad_medida": "kg",
      "precio_unitario": 15.50,
      "fecha_vencimiento": "31/12/2025",
      "fecha_registro": "21/10/2025 16:58:21"
    }
  ]
}
```

---

### ➕ Crear Inventario (Protegido)
**Endpoint:** `POST /api/inventarios`

**Body:**
```json
{
  "nombre_producto": "Vacuna Triple",
  "categoria_id": 2,
  "cantidad": 100,
  "unidad_medida": "dosis",
  "precio_unitario": 25.00,
  "fecha_vencimiento": "2026-06-30"
}
```

---

## 🏷️ Categorías de Inventario

### 📋 Listar Categorías (Protegido)
**Endpoint:** `GET /api/categorias-inventario`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "categoria_nombre": "Alimentos"},
    {"id": 2, "categoria_nombre": "Medicamentos"},
    {"id": 3, "categoria_nombre": "Herramientas"}
  ]
}
```

---

### ➕ Crear Categoría (Protegido)
**Endpoint:** `POST /api/categorias-inventario`

**Body:**
```json
{
  "categoria_nombre": "Suplementos"
}
```

---

## 👷 Empleados

### 📋 Listar Empleados (Protegido)
**Endpoint:** `GET /api/empleados`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Carlos Ramírez",
      "puesto": "Ordeñador",
      "fecha_nacimiento": "15/05/1985",
      "fecha_ingreso": "01/01/2020",
      "salario": 8000.00,
      "telefono": "5551234567",
      "estado": "Activo"
    }
  ]
}
```

---

### ➕ Crear Empleado (Protegido)
**Endpoint:** `POST /api/empleados`

**Body:**
```json
{
  "nombre": "Pedro Sánchez",
  "puesto": "Veterinario Auxiliar",
  "fecha_nacimiento": "1990-08-20",
  "fecha_ingreso": "2025-10-01",
  "salario": 12000.00,
  "telefono": "5559876543",
  "estado": "Activo"
}
```

---

## 📋 Gestión de Personal

### 📋 Listar Gestión de Personal (Protegido)
**Endpoint:** `GET /api/gestion-personal`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "empleado_id": 1,
      "nombre_empleado": "Carlos Ramírez",
      "tipo_gestion": "Asignación",
      "descripcion": "Asignado a ordeño matutino",
      "fecha": "21/10/2025 08:00:00",
      "estado": "Activo"
    }
  ]
}
```

---

### ➕ Crear Gestión de Personal (Protegido)
**Endpoint:** `POST /api/gestion-personal`

**Body:**
```json
{
  "empleado_id": 1,
  "tipo_gestion": "Capacitación",
  "descripcion": "Curso de manejo de maquinaria",
  "fecha": "2025-10-25T09:00:00",
  "estado": "Pendiente"
}
```

---

## 💰 Ventas

### 📋 Listar Ventas (Protegido)
**Endpoint:** `GET /api/ventas`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "producto": "Leche Fresca",
      "cantidad": 100,
      "precio_unitario": 18.00,
      "total": 1800.00,
      "cliente": "Distribuidora Lácteos SA",
      "fecha_venta": "21/10/2025 14:00:00"
    }
  ]
}
```

---

### ➕ Crear Venta (Protegido)
**Endpoint:** `POST /api/ventas`

**Body:**
```json
{
  "producto": "Queso Fresco",
  "cantidad": 50,
  "precio_unitario": 85.00,
  "total": 4250.00,
  "cliente": "Supermercado El Ahorro"
}
```

---

## 🧾 Facturación

### 📋 Listar Facturas (Protegido)
**Endpoint:** `GET /api/facturacion`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "venta_id": 1,
      "producto_vendido": "Leche Fresca",
      "numero_factura": "FAC-2025-001",
      "monto_total": 1800.00,
      "fecha_emision": "21/10/2025 14:30:00"
    }
  ]
}
```

---

### ➕ Crear Factura (Protegido)
**Endpoint:** `POST /api/facturacion`

**Body:**
```json
{
  "venta_id": 2,
  "numero_factura": "FAC-2025-002",
  "monto_total": 4250.00
}
```

---

## 🔔 Alertas

### 📋 Listar Alertas (Protegido)
**Endpoint:** `GET /api/alertas`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tipo_alerta": "Salud",
      "descripcion": "Vaca Luna requiere revisión veterinaria",
      "estado": "Pendiente",
      "fecha_alerta": "21/10/2025 10:00:00"
    }
  ]
}
```

---

### ➕ Crear Alerta (Protegido)
**Endpoint:** `POST /api/alertas`

**Body:**
```json
{
  "tipo_alerta": "Inventario",
  "descripcion": "Stock bajo de alimento balanceado",
  "estado": "Pendiente"
}
```

---

### ✏️ Actualizar Alerta (Protegido)
**Endpoint:** `PUT /api/alertas/:id`

**Body:**
```json
{
  "estado": "Resuelta"
}
```

---

## 🛡️ Niveles de Acceso

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **admin** | Administrador | Acceso completo a todos los endpoints |
| **supervisor** | Supervisor | Acceso a lectura y escritura, excepto gestión de usuarios |
| **empleado** | Empleado | Acceso de solo lectura y registro de actividades diarias |
| **veterinario** | Veterinario | Acceso completo a módulos de salud del ganado |

---

## 🔒 Códigos de Respuesta HTTP

| Código | Significado |
|--------|-------------|
| **200** | ✅ Operación exitosa |
| **201** | ✅ Recurso creado exitosamente |
| **400** | ❌ Error en los datos enviados |
| **401** | ❌ No autenticado (token inválido o ausente) |
| **403** | ❌ No autorizado (sin permisos) |
| **404** | ❌ Recurso no encontrado |
| **500** | ❌ Error interno del servidor |

---

## 📝 Notas Importantes

1. **Formato de Fechas:** Todas las fechas se manejan en formato **DD/MM/YYYY HH24:MI:SS**
2. **Zona Horaria:** America/Mexico_City (GMT-6)
3. **Token JWT:** Válido por **1 hora** desde su emisión
4. **Usuario Admin por defecto:**
   - Email: `admin@ganaderia.com`
   - Password: `admin123`

---

## 🚀 Ejemplo de Flujo Completo

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ganaderia.com", "password": "admin123"}'
```

### 2. Guardar el token de la respuesta
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Usar el token en siguientes peticiones
```bash
curl -X GET http://localhost:3000/api/ganado \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Crear un nuevo registro
```bash
curl -X POST http://localhost:3000/api/ganado \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Vaca Estrella",
    "raza": "Jersey",
    "sexo": "Hembra",
    "fecha_nacimiento": "2022-03-15",
    "peso": 380.0,
    "estado": "Activo"
  }'
```

---

## 🆘 Soporte

Para más información o soporte técnico, contactar al administrador del sistema.

**Versión:** 1.0.0  
**Última actualización:** Octubre 2025
