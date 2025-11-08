const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        ci.id,
        
        ci.*,
        ${sqlFormatDate('ci.id')} as fecha_formatted
      FROM categorias_inventario ci
      
      ORDER BY ci.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll categorias_inventario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categorías de inventario', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        ci.id,
        
        ci.*
      FROM categorias_inventario ci
      
      WHERE ci.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById categorias_inventario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['categoria_nombre'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO categorias_inventario (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Categorías de Inventario creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create categorias_inventario:', error);
    res.status(500).json({ success: false, message: 'Error al crear categorías de inventario', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCounter = 1;

    
    if (data.categoria_nombre !== undefined) {
      updates.push(`categoria_nombre = $${paramCounter++}`);
      values.push(data.categoria_nombre);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE categorias_inventario SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Categorías de Inventario actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update categorias_inventario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar categorías de inventario', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM categorias_inventario WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Categorías de Inventario eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove categorias_inventario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar categorías de inventario', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
