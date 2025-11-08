const db = require('../db/config');

// Obtener todos los registros de ejemplo
const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        NOW() as fecha_hora_actual,
        CURRENT_DATE as fecha_actual,
        CURRENT_TIME as hora_actual,
        TO_CHAR(NOW(), 'DD/MM/YYYY HH24:MI:SS') as formato_espanol,
        version() as db_version
    `);
    res.json({
      success: true,
      message: 'Conexión exitosa a la base de datos',
      data: result.rows,
      timezone: process.env.TZ || 'UTC'
    });
  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos',
      error: error.message
    });
  }
};

// Obtener un registro por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    // Ejemplo de consulta parametrizada
    // const result = await db.query('SELECT * FROM tabla WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: `Obteniendo registro con ID: ${id}`,
      data: { id }
    });
  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el registro',
      error: error.message
    });
  }
};

// Crear un nuevo registro
const create = async (req, res) => {
  try {
    const data = req.body;
    // Ejemplo de inserción
    // const result = await db.query(
    //   'INSERT INTO tabla (campo1, campo2) VALUES ($1, $2) RETURNING *',
    //   [data.campo1, data.campo2]
    // );
    
    res.status(201).json({
      success: true,
      message: 'Registro creado exitosamente',
      data: data
    });
  } catch (error) {
    console.error('Error en create:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el registro',
      error: error.message
    });
  }
};

// Actualizar un registro
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    // Ejemplo de actualización
    // const result = await db.query(
    //   'UPDATE tabla SET campo1 = $1, campo2 = $2 WHERE id = $3 RETURNING *',
    //   [data.campo1, data.campo2, id]
    // );
    
    res.json({
      success: true,
      message: 'Registro actualizado exitosamente',
      data: { id, ...data }
    });
  } catch (error) {
    console.error('Error en update:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el registro',
      error: error.message
    });
  }
};

// Eliminar un registro
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    // Ejemplo de eliminación
    // const result = await db.query('DELETE FROM tabla WHERE id = $1 RETURNING *', [id]);
    
    res.json({
      success: true,
      message: 'Registro eliminado exitosamente',
      data: { id }
    });
  } catch (error) {
    console.error('Error en remove:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el registro',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
