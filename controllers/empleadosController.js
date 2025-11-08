const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        nombre_empleado,
        puesto,
        ${sqlFormatDate('fecha_ingreso')} as fecha_ingreso,
        TO_CHAR(fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento,
        telefono,
        correo,
        estado
      FROM empleados
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll empleados:', error);
    res.status(500).json({ success: false, message: 'Error al obtener empleados', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        id,
        nombre_empleado,
        puesto,
        ${sqlFormatDate('fecha_ingreso')} as fecha_ingreso,
        TO_CHAR(fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento,
        telefono,
        correo,
        estado
      FROM empleados
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById empleados:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['nombre_empleado', 'puesto', 'fecha_nacimiento', 'telefono', 'correo', 'estado'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO empleados (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Empleados creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create empleados:', error);
    res.status(500).json({ success: false, message: 'Error al crear empleados', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCounter = 1;

    
    if (data.nombre_empleado !== undefined) {
      updates.push(`nombre_empleado = $${paramCounter++}`);
      values.push(data.nombre_empleado);
    }
    if (data.puesto !== undefined) {
      updates.push(`puesto = $${paramCounter++}`);
      values.push(data.puesto);
    }
    if (data.fecha_nacimiento !== undefined) {
      updates.push(`fecha_nacimiento = $${paramCounter++}`);
      values.push(data.fecha_nacimiento);
    }
    if (data.telefono !== undefined) {
      updates.push(`telefono = $${paramCounter++}`);
      values.push(data.telefono);
    }
    if (data.correo !== undefined) {
      updates.push(`correo = $${paramCounter++}`);
      values.push(data.correo);
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
      UPDATE empleados SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Empleados actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update empleados:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar empleados', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM empleados WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Empleados eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove empleados:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar empleados', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
