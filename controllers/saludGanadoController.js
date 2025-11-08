const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        sg.id,
        sg.ganado_id,
        g.nombre as ganado_nombre,
        g.rfid as ganado_rfid,
        sg.temperatura,
        sg.comportamiento,
        sg.observaciones,
        ${sqlFormatDate('sg.fecha_registro')} as fecha_registro
      FROM salud_ganado sg
      LEFT JOIN ganado g ON sg.ganado_id = g.id
      ORDER BY sg.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll salud_ganado:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registros de salud', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        sg.id,
        sg.ganado_id,
        g.nombre as ganado_nombre,
        sg.temperatura,
        sg.comportamiento,
        sg.observaciones,
        ${sqlFormatDate('sg.fecha_registro')} as fecha_registro
      FROM salud_ganado sg
      LEFT JOIN ganado g ON sg.ganado_id = g.id
      WHERE sg.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById salud_ganado:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { ganado_id, temperatura, comportamiento, observaciones } = req.body;

    const result = await db.query(`
      INSERT INTO salud_ganado (ganado_id, temperatura, comportamiento, observaciones)
      VALUES ($1, $2, $3, $4)
      RETURNING id, ganado_id, temperatura, comportamiento, observaciones, ${sqlFormatDate('fecha_registro')} as fecha_registro
    `, [ganado_id, temperatura, comportamiento, observaciones]);

    res.status(201).json({ success: true, message: 'Registro creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create salud_ganado:', error);
    res.status(500).json({ success: false, message: 'Error al crear registro', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ganado_id, temperatura, comportamiento, observaciones } = req.body;

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (ganado_id !== undefined) { updates.push(`ganado_id = $${paramCounter++}`); values.push(ganado_id); }
    if (temperatura !== undefined) { updates.push(`temperatura = $${paramCounter++}`); values.push(temperatura); }
    if (comportamiento !== undefined) { updates.push(`comportamiento = $${paramCounter++}`); values.push(comportamiento); }
    if (observaciones !== undefined) { updates.push(`observaciones = $${paramCounter++}`); values.push(observaciones); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE salud_ganado SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING id, ganado_id, temperatura, comportamiento, observaciones, ${sqlFormatDate('fecha_registro')} as fecha_registro
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Registro actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update salud_ganado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar registro', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM salud_ganado WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Registro eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove salud_ganado:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar registro', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
