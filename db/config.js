const { Pool } = require('pg');
const { types } = require('pg');
require('dotenv').config();

// Configurar el parser de fechas de PostgreSQL para formato español
// Por defecto, pg devuelve TIMESTAMP como string
types.setTypeParser(1114, (str) => {
  // 1114 = TIMESTAMP sin zona horaria
  return str; // Devolver como string para formatear manualmente
});

types.setTypeParser(1184, (str) => {
  // 1184 = TIMESTAMP con zona horaria
  return str; // Devolver como string para formatear manualmente
});

// Configuración del pool de conexiones a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // Máximo número de clientes en el pool
  idleTimeoutMillis: 30000, // Tiempo que un cliente puede estar inactivo antes de ser cerrado
  connectionTimeoutMillis: 2000, // Tiempo máximo de espera para conectar
  ssl: {
    rejectUnauthorized: false // Requerido para Aiven y otras bases de datos cloud
  }
});

// Evento cuando se conecta un cliente
pool.on('connect', () => {
  console.log('🔗 Conectado a la base de datos PostgreSQL');
});

// Evento de error
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el cliente de PostgreSQL', err);
  process.exit(-1);
});

// Función para verificar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    
    // Configurar formato de fecha para la sesión
    await client.query("SET datestyle = 'ISO, DMY'"); // Formato día/mes/año
    await client.query("SET timezone = 'America/Mexico_City'"); // Zona horaria
    await client.query("SET lc_time = 'es_ES.UTF-8'"); // Locale en español
    
    const result = await client.query('SELECT NOW() as now, CURRENT_DATE as date, CURRENT_TIME as time');
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    console.log('⏰ Hora del servidor:', result.rows[0].now);
    console.log('📅 Fecha actual:', result.rows[0].date);
    console.log('🕐 Hora actual:', result.rows[0].time);
    client.release();
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    throw err;
  }
};

// Función helper para formatear fechas en formato español DD/MM/YYYY HH24:MI:SS
const formatDateES = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Wrapper para queries que configura el formato de fecha
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    await client.query("SET datestyle = 'ISO, DMY'");
    await client.query("SET timezone = 'America/Mexico_City'");
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  testConnection,
  formatDateES
};
