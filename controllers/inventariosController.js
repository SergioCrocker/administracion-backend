const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        i.id,
        c.categoria_nombre,
        i.*,
        ${sqlFormatDate('i.fecha_registro')} as fecha_formatted
      FROM inventarios i
      LEFT JOIN categorias_inventario c ON inv.categoria_id = c.id
      ORDER BY i.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll inventarios:', error);
    res.status(500).json({ success: false, message: 'Error al obtener inventarios', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        i.id,
        c.categoria_nombre,
        i.*
      FROM inventarios i
      LEFT JOIN categorias_inventario c ON inv.categoria_id = c.id
      WHERE i.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById inventarios:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['nombre_producto', 'cantidad', 'unidad', 'precio_unitario', 'categoria_id'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO inventarios (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Inventarios creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create inventarios:', error);
    res.status(500).json({ success: false, message: 'Error al crear inventarios', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCounter = 1;

    
    if (data.nombre_producto !== undefined) {
      updates.push(`nombre_producto = $${paramCounter++}`);
      values.push(data.nombre_producto);
    }
    if (data.cantidad !== undefined) {
      updates.push(`cantidad = $${paramCounter++}`);
      values.push(data.cantidad);
    }
    if (data.unidad !== undefined) {
      updates.push(`unidad = $${paramCounter++}`);
      values.push(data.unidad);
    }
    if (data.precio_unitario !== undefined) {
      updates.push(`precio_unitario = $${paramCounter++}`);
      values.push(data.precio_unitario);
    }
    if (data.categoria_id !== undefined) {
      updates.push(`categoria_id = $${paramCounter++}`);
      values.push(data.categoria_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE inventarios SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Inventarios actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update inventarios:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar inventarios', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM inventarios WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Inventarios eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove inventarios:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar inventarios', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
