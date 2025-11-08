const db = require('../db/config');
const { sqlFormatDate } = require('../utils/dateUtils');

const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        f.id,
        v.producto as venta_producto, v.cliente_nombre,
        f.*,
        ${sqlFormatDate('f.fecha_emision')} as fecha_formatted
      FROM facturacion f
      LEFT JOIN ventas v ON f.venta_id = v.id
      ORDER BY f.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll facturacion:', error);
    res.status(500).json({ success: false, message: 'Error al obtener facturación', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        f.id,
        v.producto as venta_producto, v.cliente_nombre,
        f.*
      FROM facturacion f
      LEFT JOIN ventas v ON f.venta_id = v.id
      WHERE f.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getById facturacion:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registro', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const fields = ['venta_id', 'numero_factura', 'monto_total'];
    const values = fields.map(f => data[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await db.query(`
      INSERT INTO facturacion (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `, values);

    res.status(201).json({ success: true, message: 'Facturación creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en create facturacion:', error);
    res.status(500).json({ success: false, message: 'Error al crear facturación', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCounter = 1;

    
    if (data.venta_id !== undefined) {
      updates.push(`venta_id = $${paramCounter++}`);
      values.push(data.venta_id);
    }
    if (data.numero_factura !== undefined) {
      updates.push(`numero_factura = $${paramCounter++}`);
      values.push(data.numero_factura);
    }
    if (data.monto_total !== undefined) {
      updates.push(`monto_total = $${paramCounter++}`);
      values.push(data.monto_total);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE facturacion SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Facturación actualizado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en update facturacion:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar facturación', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM facturacion WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true, message: 'Facturación eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error en remove facturacion:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar facturación', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
