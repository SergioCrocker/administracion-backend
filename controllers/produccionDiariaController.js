const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        pd.id,
        g.nombre as ganado_nombre, g.rfid as ganado_rfid,
        pd.*,
        ${sqlFormatDate('pd.fecha')} as fecha_formatted
      FROM produccion_diaria pd
      LEFT JOIN ganado g ON pd.ganado_id = g.id
      ORDER BY pd.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll produccion_diaria:', error);
    res.status(500).json({ success: false, message: 'Error al obtener producción diaria', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        pd.id,
        g.nombre as ganado_nombre, g.rfid as ganado_rfid,
        pd.*
      FROM produccion_diaria pd
      LEFT JOIN ganado g ON pd.ganado_id = g.id
      WHERE pd.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById produccion_diaria:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['ganado_id', 'fecha', 'cantidad_leche'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO produccion_diaria (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Producción Diaria creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create produccion_diaria:', error);
    res.status(500).json({ success: false, message: 'Error al crear producción diaria', error: error.message });
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
    if (data.fecha !== undefined) {
      updates.push(`fecha = $${paramCounter++}`);
      values.push(data.fecha);
    }
    if (data.cantidad_leche !== undefined) {
      updates.push(`cantidad_leche = $${paramCounter++}`);
      values.push(data.cantidad_leche);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE produccion_diaria SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Producción Diaria actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update produccion_diaria:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar producción diaria', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM produccion_diaria WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Producción Diaria eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove produccion_diaria:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar producción diaria', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
