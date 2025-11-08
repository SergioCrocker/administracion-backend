# Backend - Administración Ganadera

Backend para el sistema de administración ganadera desarrollado con Node.js, Express y PostgreSQL 16.

## 📋 Requisitos

- Docker Desktop
- Node.js 18+ (para desarrollo local)
- PostgreSQL 16 (si no usas Docker)

## 🚀 Inicio Rápido con Docker

### 1. Construir e iniciar los contenedores

```bash
# Iniciar todos los servicios (PostgreSQL + Backend)
docker-compose up -d

# Ver los logs
docker-compose logs -f

# Detener los servicios
docker-compose down
```

### 2. Verificar que todo funciona

- Backend: http://localhost:3000/health
- PostgreSQL: localhost:5432

## 📁 Estructura del Proyecto

```
backend/
├── controllers/          # Controladores de la aplicación
│   └── exampleController.js
├── routes/              # Definición de rutas
│   ├── exampleRoutes.js
│   └── index.js         # Registro de todas las rutas
├── db/                  # Configuración de base de datos
│   └── config.js        # Pool de conexiones PostgreSQL
├── .env                 # Variables de entorno
├── .env.example         # Ejemplo de variables de entorno
├── index.js             # Punto de entrada de la aplicación
├── package.json         # Dependencias del proyecto
├── Dockerfile           # Configuración de Docker
├── docker-compose.yml   # Orquestación de servicios
└── base.sql            # Script inicial de base de datos
```

## 🔧 Desarrollo Local (sin Docker)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

### 3. Asegúrate de tener PostgreSQL 16 corriendo

```bash
# Verifica la conexión
psql -h localhost -U postgres -d administracion_ganadera
```

### 4. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 🔌 Endpoints Disponibles

### Health Check
```
GET /health
```

### Ejemplos (CRUD)
```
GET    /api/examples        # Obtener todos
GET    /api/examples/:id    # Obtener por ID
POST   /api/examples        # Crear nuevo
PUT    /api/examples/:id    # Actualizar
DELETE /api/examples/:id    # Eliminar
```

## 🐳 Comandos Docker Útiles

```bash
# Ver contenedores en ejecución
docker ps

# Acceder al contenedor del backend
docker exec -it administracion_ganadera_backend sh

# Acceder a PostgreSQL
docker exec -it administracion_ganadera_db psql -U postgres -d administracion_ganadera

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f postgres

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir las imágenes
docker-compose up -d --build

# Eliminar todo (contenedores, volúmenes, redes)
docker-compose down -v
```

## 🔐 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto del servidor | 3000 |
| NODE_ENV | Entorno de ejecución | development |
| DB_HOST | Host de PostgreSQL | localhost |
| DB_PORT | Puerto de PostgreSQL | 5432 |
| DB_USER | Usuario de la BD | postgres |
| DB_PASSWORD | Contraseña de la BD | postgres |
| DB_NAME | Nombre de la BD | administracion_ganadera |
| TZ | Zona horaria | America/Mexico_City |
| LOCALE | Configuración regional | es_MX.UTF-8 |

## 📅 Manejo de Fechas y Horas

El sistema está configurado para usar formato **DD/MM/YYYY** y hora en **formato de 24 horas**.

### Configuración
- **Zona horaria**: America/Mexico_City
- **Formato de fecha**: DD/MM/YYYY
- **Formato de hora**: HH:MM:SS (24 horas)
- **Locale**: Español (es_ES/es_MX)

### Uso en Código

```javascript
// Importar utilidades de fecha
const { formatDateTimeES, formatDateES, sqlFormatDate } = require('../utils/dateUtils');

// Formatear fecha actual
const ahora = formatDateTimeES(new Date());
// Resultado: "21/10/2025 14:30:45"

// En consultas SQL
const query = `
  SELECT 
    id,
    nombre,
    TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI:SS') as fecha_creacion
  FROM tabla
`;

// O usando la utilidad
const query2 = `
  SELECT 
    id,
    nombre,
    ${sqlFormatDate('created_at')} as fecha_creacion
  FROM tabla
`;
```

### Ejemplos de Formato

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Fecha completa | DD/MM/YYYY HH:MM:SS | 21/10/2025 14:30:45 |
| Solo fecha | DD/MM/YYYY | 21/10/2025 |
| Solo hora | HH:MM:SS | 14:30:45 |

## 📝 String de Conexión PostgreSQL

El string de conexión se construye automáticamente en `db/config.js` usando las variables de entorno:

```javascript
const pool = new Pool({
  host: process.env.DB_HOST,      // localhost
  port: process.env.DB_PORT,      // 5432
  user: process.env.DB_USER,      // postgres
  password: process.env.DB_PASSWORD, // postgres
  database: process.env.DB_NAME   // administracion_ganadera
});
```

## 🛠️ Tecnologías

- **Node.js 18** - Runtime de JavaScript
- **Express 4** - Framework web
- **PostgreSQL 16** - Base de datos
- **pg** - Cliente de PostgreSQL para Node.js
- **dotenv** - Manejo de variables de entorno
- **cors** - Middleware para CORS
- **Docker** - Contenedorización

## 📦 Agregar Nuevos Módulos

1. Crear el controlador en `controllers/`
2. Crear las rutas en `routes/`
3. Registrar las rutas en `routes/index.js`

## 🐛 Solución de Problemas

### El backend no se conecta a la base de datos

```bash
# Verifica que PostgreSQL esté corriendo
docker-compose ps

# Revisa los logs de PostgreSQL
docker-compose logs postgres
```

### Puerto 3000 o 5432 ya en uso

Cambia los puertos en `docker-compose.yml` o en `.env`

### Necesitas reiniciar la base de datos

```bash
# Esto eliminará todos los datos
docker-compose down -v
docker-compose up -d
```

## 📄 Licencia

ISC
