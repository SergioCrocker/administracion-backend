const express = require('express');
const router = express.Router();
const { formatDateTimeES, formatDateES, formatTimeES, getCurrentDateTimeES } = require('../utils/dateUtils');

// Endpoint para probar formatos de fecha
router.get('/datetime', (req, res) => {
  const now = new Date();
  
  res.json({
    success: true,
    message: 'Formatos de fecha y hora en español',
    data: {
      fecha_hora_completa: formatDateTimeES(now),
      solo_fecha: formatDateES(now),
      solo_hora: formatTimeES(now),
      fecha_hora_actual: getCurrentDateTimeES(),
      iso_original: now.toISOString(),
      zona_horaria: process.env.TZ || 'UTC',
      locale: process.env.LOCALE || 'en_US.UTF-8'
    }
  });
});

// Endpoint para obtener fecha/hora del servidor de base de datos
router.get('/db-datetime', async (req, res) => {
  try {
    const db = require('../db/config');
    const result = await db.query(`
      SELECT 
        TO_CHAR(NOW(), 'DD/MM/YYYY HH24:MI:SS') as fecha_hora_completa,
        TO_CHAR(NOW(), 'DD/MM/YYYY') as solo_fecha,
        TO_CHAR(NOW(), 'HH24:MI:SS') as solo_hora,
        TO_CHAR(NOW(), 'Day, DD "de" Month "de" YYYY') as fecha_texto,
        CURRENT_DATE as fecha_sql,
        CURRENT_TIME as hora_sql,
        NOW() as timestamp_sql
      FROM (SELECT 1) as dummy
    `);
    
    res.json({
      success: true,
      message: 'Fecha y hora desde PostgreSQL',
      data: result.rows[0],
      configuracion: {
        zona_horaria: process.env.TZ || 'UTC',
        formato_fecha: 'DD/MM/YYYY',
        formato_hora: '24 horas (HH24:MI:SS)'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener fecha de la base de datos',
      error: error.message
    });
  }
});

module.exports = router;
