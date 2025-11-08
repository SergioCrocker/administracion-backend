const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        hp.id,
        g.nombre as ganado_nombre, g.rfid as ganado_rfid,
        hp.*,
        ${sqlFormatDate('hp.fecha_inicio')} as fecha_formatted
      FROM historico_produccion hp
      LEFT JOIN ganado g ON hp.ganado_id = g.id
      ORDER BY hp.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll historico_produccion:', error);
    res.status(500).json({ success: false, message: 'Error al obtener histórico de producción', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        hp.id,
        g.nombre as ganado_nombre, g.rfid as ganado_rfid,
        hp.*
      FROM historico_produccion hp
      LEFT JOIN ganado g ON hp.ganado_id = g.id
      WHERE hp.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById historico_produccion:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['ganado_id', 'cantidad_leche', 'fecha_inicio', 'fecha_fin'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO historico_produccion (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Histórico de Producción creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create historico_produccion:', error);
    res.status(500).json({ success: false, message: 'Error al crear histórico de producción', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCounter = 1;

    
    if (data.ganado_id !== undefined) {
      updates.push(`ganado_id = $${paramCounter++}`);
      values.push(data.ganado_id);
    }
    if (data.cantidad_leche !== undefined) {
      updates.push(`cantidad_leche = $${paramCounter++}`);
      values.push(data.cantidad_leche);
    }
    if (data.fecha_inicio !== undefined) {
      updates.push(`fecha_inicio = $${paramCounter++}`);
      values.push(data.fecha_inicio);
    }
    if (data.fecha_fin !== undefined) {
      updates.push(`fecha_fin = $${paramCounter++}`);
      values.push(data.fecha_fin);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE historico_produccion SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Histórico de Producción actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update historico_produccion:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar histórico de producción', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM historico_produccion WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Histórico de Producción eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove historico_produccion:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar histórico de producción', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
