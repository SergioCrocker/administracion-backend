-- La base de datos 'administracion_ganadera' ya fue creada por POSTGRES_DB en docker-compose
-- Solo nos conectamos a ella
\c administracion_ganadera;

-- =========================
--  Tablas de Autenticación
-- =========================

-- roles
CREATE TABLE roles (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- usuarios
CREATE TABLE usuarios (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    rol_id          INT REFERENCES roles(id),
    activo          BOOLEAN DEFAULT TRUE,
    fecha_creacion  TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Insertar roles por defecto
INSERT INTO roles (nombre, descripcion) VALUES 
    ('admin', 'Administrador con acceso completo al sistema'),
    ('supervisor', 'Supervisor con acceso a la mayoría de funciones'),
    ('empleado', 'Empleado con acceso limitado'),
    ('veterinario', 'Veterinario con acceso a salud del ganado');

-- Insertar usuario admin por defecto (password: admin123)
INSERT INTO usuarios (nombre, email, password, rol_id) VALUES 
    ('Administrador', 'admin@ganaderia.com', '$2a$10$WWiEbpKQW4SM4RnU2UwXjOgWWeYs/OqLjt76C72LvtCre9ngmQ/zK', 1);

-- =========================
--  Tablas principales
-- =========================

-- ganado
CREATE TABLE ganado (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rfid            VARCHAR(50) NOT NULL,
    nombre          VARCHAR(100),
    fecha_nacimiento DATE,
    raza            VARCHAR(50),
    estado          VARCHAR(50),
    fecha_registro  TIMESTAMP DEFAULT NOW()
);

-- salud_ganado
CREATE TABLE salud_ganado (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ganado_id       INT REFERENCES ganado(id),
    temperatura     NUMERIC(5,2),
    comportamiento  TEXT,
    observaciones   TEXT,
    fecha_registro  TIMESTAMP DEFAULT NOW()
);

-- produccion_leche
CREATE TABLE produccion_leche (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ganado_id        INT REFERENCES ganado(id),
    cantidad_leche   NUMERIC(10,2),
    calidad_leche    NUMERIC(5,2),
    fecha_oreno      TIMESTAMP
);

-- inventarios
CREATE TABLE inventarios (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_producto  VARCHAR(100),
    cantidad         INT,
    unidad           VARCHAR(20),
    precio_unitario  NUMERIC(10,2),
    fecha_registro   TIMESTAMP DEFAULT NOW()
);

-- categorias_inventario
CREATE TABLE categorias_inventario (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria_nombre VARCHAR(100)
);

-- relación inventarios -> categorias_inventario
ALTER TABLE inventarios
  ADD COLUMN categoria_id INT REFERENCES categorias_inventario(id);

-- empleados
CREATE TABLE empleados (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_empleado  VARCHAR(100),
    puesto           VARCHAR(50),
    fecha_ingreso    TIMESTAMP DEFAULT NOW(),
    fecha_nacimiento DATE,
    telefono         VARCHAR(15),
    correo           VARCHAR(100),
    estado           VARCHAR(50)
);

-- gestion_personal
CREATE TABLE gestion_personal (
    id                 INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    empleado_id        INT REFERENCES empleados(id),
    tarea              VARCHAR(100),
    fecha_asignacion   TIMESTAMP,
    fecha_finalizacion TIMESTAMP,
    estado             VARCHAR(50)
);

-- ventas
CREATE TABLE ventas (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    producto         VARCHAR(100),
    cantidad         NUMERIC(10,2),
    precio_unitario  NUMERIC(10,2),
    cliente_nombre   VARCHAR(100),
    cliente_direccion VARCHAR(255),
    fecha_venta      TIMESTAMP DEFAULT NOW()
);

-- facturacion
CREATE TABLE facturacion (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    venta_id       INT REFERENCES ventas(id),
    numero_factura VARCHAR(50),
    monto_total    NUMERIC(10,2),
    fecha_emision  TIMESTAMP DEFAULT NOW()
);

-- produccion_diaria
CREATE TABLE produccion_diaria (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ganado_id        INT REFERENCES ganado(id),
    fecha            DATE,
    cantidad_leche   NUMERIC(10,2)
);

-- alertas
CREATE TABLE alertas (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_alerta  VARCHAR(100),
    mensaje      TEXT,
    fecha_alerta TIMESTAMP DEFAULT NOW()
);

-- historico_salud
CREATE TABLE historico_salud (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ganado_id     INT REFERENCES ganado(id),
    estado_salud  VARCHAR(100),
    observaciones TEXT,
    fecha_inicio  TIMESTAMP,
    fecha_fin     TIMESTAMP
);

-- historico_produccion
CREATE TABLE historico_produccion (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ganado_id      INT REFERENCES ganado(id),
    cantidad_leche NUMERIC(10,2),
    fecha_inicio   TIMESTAMP,
    fecha_fin      TIMESTAMP
);

-- =========================
--  Índices
-- =========================
CREATE INDEX idx_produccion_leche_fecha ON produccion_leche (fecha_oreno);
CREATE INDEX idx_salud_ganado_fecha     ON salud_ganado (fecha_registro);
CREATE INDEX idx_ventas_fecha           ON ventas (fecha_venta);
CREATE INDEX idx_usuarios_email         ON usuarios (email);
CREATE INDEX idx_usuarios_rol           ON usuarios (rol_id);
