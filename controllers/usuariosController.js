const db = require('../db/config');
const bcrypt = require('bcryptjs');
const { sqlFormatDate } = require('../utils/dateUtils');

/**
 * Obtener todos los usuarios
 */
const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.activo,
        r.id as rol_id,
        r.nombre as rol_nombre,
        ${sqlFormatDate('u.fecha_creacion')} as fecha_creacion,
        ${sqlFormatDate('u.fecha_actualizacion')} as fecha_actualizacion
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAll usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

/**
 * Obtener usuario por ID
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.activo,
        r.id as rol_id,
        r.nombre as rol_nombre,
        r.descripcion as rol_descripcion,
        ${sqlFormatDate('u.fecha_creacion')} as fecha_creacion,
        ${sqlFormatDate('u.fecha_actualizacion')} as fecha_actualizacion
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en getById usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

/**
 * Crear nuevo usuario
 */
const create = async (req, res) => {
  try {
    const { nombre, email, password, rol_id, activo } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    // Verificar si el email ya existe
    const existingUser = await db.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await db.query(`
      INSERT INTO usuarios (nombre, email, password, rol_id, activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id,
        nombre,
        email,
        rol_id,
        activo,
        ${sqlFormatDate('fecha_creacion')} as fecha_creacion
    `, [nombre, email, hashedPassword, rol_id || 3, activo !== undefined ? activo : true]);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en create usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

/**
 * Actualizar usuario
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol_id, activo } = req.body;

    // Verificar si el usuario existe
    const existingUser = await db.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Si se proporciona un nuevo email, verificar que no exista
    if (email) {
      const emailCheck = await db.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso por otro usuario'
        });
      }
    }

    // Construir query dinámico
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (nombre) {
      updates.push(`nombre = $${paramCounter++}`);
      values.push(nombre);
    }
    if (email) {
      updates.push(`email = $${paramCounter++}`);
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramCounter++}`);
      values.push(hashedPassword);
    }
    if (rol_id !== undefined) {
      updates.push(`rol_id = $${paramCounter++}`);
      values.push(rol_id);
    }
    if (activo !== undefined) {
      updates.push(`activo = $${paramCounter++}`);
      values.push(activo);
    }

    updates.push(`fecha_actualizacion = NOW()`);
    values.push(id);

    const result = await db.query(`
      UPDATE usuarios 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING 
        id,
        nombre,
        email,
        rol_id,
        activo,
        ${sqlFormatDate('fecha_creacion')} as fecha_creacion,
        ${sqlFormatDate('fecha_actualizacion')} as fecha_actualizacion
    `, values);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en update usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

/**
 * Eliminar usuario (soft delete - desactivar)
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      UPDATE usuarios 
      SET activo = false, fecha_actualizacion = NOW()
      WHERE id = $1
      RETURNING id, nombre, email, activo
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en remove usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar usuario',
      error: error.message
    });
  }
};

/**
 * Obtener todos los roles
 */
const getRoles = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        nombre,
        descripcion,
        ${sqlFormatDate('fecha_creacion')} as fecha_creacion
      FROM roles
      ORDER BY id
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getRoles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener roles',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getRoles
};
