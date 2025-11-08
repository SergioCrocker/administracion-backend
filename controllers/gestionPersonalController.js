const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        gp.id,
        e.nombre_empleado,
        gp.*,
        ${sqlFormatDate('gp.fecha_asignacion')} as fecha_formatted
      FROM gestion_personal gp
      LEFT JOIN empleados e ON gp.empleado_id = e.id
      ORDER BY gp.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll gestion_personal:', error);
    res.status(500).json({ success: false, message: 'Error al obtener gestión de personal', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        gp.id,
        e.nombre_empleado,
        gp.*
      FROM gestion_personal gp
      LEFT JOIN empleados e ON gp.empleado_id = e.id
      WHERE gp.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById gestion_personal:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['empleado_id', 'tarea', 'fecha_asignacion', 'fecha_finalizacion', 'estado'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO gestion_personal (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Gestión de Personal creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create gestion_personal:', error);
    res.status(500).json({ success: false, message: 'Error al crear gestión de personal', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCounter = 1;

    
    if (data.empleado_id !== undefined) {
      updates.push(`empleado_id = $${paramCounter++}`);
      values.push(data.empleado_id);
    }
    if (data.tarea !== undefined) {
      updates.push(`tarea = $${paramCounter++}`);
      values.push(data.tarea);
    }
    if (data.fecha_asignacion !== undefined) {
      updates.push(`fecha_asignacion = $${paramCounter++}`);
      values.push(data.fecha_asignacion);
    }
    if (data.fecha_finalizacion !== undefined) {
      updates.push(`fecha_finalizacion = $${paramCounter++}`);
      values.push(data.fecha_finalizacion);
    }
    if (data.estado !== undefined) {
      updates.push(`estado = $${paramCounter++}`);
      values.push(data.estado);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE gestion_personal SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Gestión de Personal actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update gestion_personal:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar gestión de personal', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM gestion_personal WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Gestión de Personal eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove gestion_personal:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar gestión de personal', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
