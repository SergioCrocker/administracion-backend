const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.id,
        
        a.*,
        ${sqlFormatDate('a.fecha_alerta')} as fecha_formatted
      FROM alertas a
      
      ORDER BY a.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll alertas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener alertas', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        a.id,
        
        a.*
      FROM alertas a
      
      WHERE a.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById alertas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['tipo_alerta', 'mensaje'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO alertas (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Alertas creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create alertas:', error);
    res.status(500).json({ success: false, message: 'Error al crear alertas', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCounter = 1;

    
    if (data.tipo_alerta !== undefined) {
      updates.push(`tipo_alerta = $${paramCounter++}`);
      values.push(data.tipo_alerta);
    }
    if (data.mensaje !== undefined) {
      updates.push(`mensaje = $${paramCounter++}`);
      values.push(data.mensaje);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE alertas SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Alertas actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update alertas:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar alertas', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM alertas WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Alertas eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove alertas:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar alertas', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
