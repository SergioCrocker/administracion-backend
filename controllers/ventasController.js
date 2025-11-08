const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        producto,
        cantidad,
        precio_unitario,
        cliente_nombre,
        cliente_direccion,
        ${sqlFormatDate('fecha_venta')} as fecha_venta
      FROM ventas
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll ventas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener ventas', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        id,
        producto,
        cantidad,
        precio_unitario,
        cliente_nombre,
        cliente_direccion,
        ${sqlFormatDate('fecha_venta')} as fecha_venta
      FROM ventas
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById ventas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['producto', 'cantidad', 'precio_unitario', 'cliente_nombre', 'cliente_direccion'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO ventas (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Ventas creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create ventas:', error);
    res.status(500).json({ success: false, message: 'Error al crear ventas', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCounter = 1;

    
    if (data.producto !== undefined) {
      updates.push(`producto = $${paramCounter++}`);
      values.push(data.producto);
    }
    if (data.cantidad !== undefined) {
      updates.push(`cantidad = $${paramCounter++}`);
      values.push(data.cantidad);
    }
    if (data.precio_unitario !== undefined) {
      updates.push(`precio_unitario = $${paramCounter++}`);
      values.push(data.precio_unitario);
    }
    if (data.cliente_nombre !== undefined) {
      updates.push(`cliente_nombre = $${paramCounter++}`);
      values.push(data.cliente_nombre);
    }
    if (data.cliente_direccion !== undefined) {
      updates.push(`cliente_direccion = $${paramCounter++}`);
      values.push(data.cliente_direccion);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE ventas SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Ventas actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update ventas:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar ventas', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM ventas WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Ventas eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove ventas:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar ventas', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
