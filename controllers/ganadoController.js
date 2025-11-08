const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

// Obtener todo el ganado
const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        rfid,
        nombre,
        TO_CHAR(fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento,
        raza,
        estado,
        ${sqlFormatDate('fecha_registro')} as fecha_registro
      FROM ganado
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll ganado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ganado',
      error: error.message
    });
  }
};

// Obtener ganado por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        id,
        rfid,
        nombre,
        TO_CHAR(fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento,
        raza,
        estado,
        ${sqlFormatDate('fecha_registro')} as fecha_registro
      FROM ganado
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ganado no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en getById ganado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ganado',
      error: error.message
    });
  }
};

// Crear nuevo ganado
const create = async (req, res) => {
  try {
    const { rfid, nombre, fecha_nacimiento, raza, estado } = req.body;

    if (!rfid) {
      return res.status(400).json({
        success: false,
        message: 'RFID es requerido'
      });
    }

    const result = await db.query(`
      INSERT INTO ganado (rfid, nombre, fecha_nacimiento, raza, estado)
      VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5)
      RETURNING 
        id,
        rfid,
        nombre,
        TO_CHAR(fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento,
        raza,
        estado,
        ${sqlFormatDate('fecha_registro')} as fecha_registro
    `, [rfid, nombre, fecha_nacimiento, raza, estado || 'activo']);

    res.status(201).json({
      success: true,
      message: 'Ganado creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en create ganado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear ganado',
      error: error.message
    });
  }
};

// Actualizar ganado
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { rfid, nombre, fecha_nacimiento, raza, estado } = req.body;

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (rfid) {
      updates.push(`rfid = $${paramCounter++}`);
      values.push(rfid);
    }
    if (nombre) {
      updates.push(`nombre = $${paramCounter++}`);
      values.push(nombre);
    }
    if (fecha_nacimiento) {
      updates.push(`fecha_nacimiento = TO_DATE($${paramCounter++}, 'DD/MM/YYYY')`);
      values.push(fecha_nacimiento);
    }
    if (raza) {
      updates.push(`raza = $${paramCounter++}`);
      values.push(raza);
    }
    if (estado) {
      updates.push(`estado = $${paramCounter++}`);
      values.push(estado);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE ganado
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING 
        id,
        rfid,
        nombre,
        TO_CHAR(fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento,
        raza,
        estado,
        ${sqlFormatDate('fecha_registro')} as fecha_registro
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ganado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Ganado actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en update ganado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar ganado',
      error: error.message
    });
  }
};

// Eliminar ganado
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM ganado WHERE id = $1 RETURNING id, rfid, nombre', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ganado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Ganado eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en remove ganado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar ganado',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
