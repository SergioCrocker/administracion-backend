const db = require('../db/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sqlFormatDate } = require('../utils/dateUtils');

/**
 * Login de usuario
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen credenciales
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const result = await db.query(`
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.password,
        u.activo,
        r.id as rol_id,
        r.nombre as rol_nombre,
        ${sqlFormatDate('u.fecha_creacion')} as fecha_creacion
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.email = $1
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.rol_nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Retornar usuario sin contraseña
    delete user.password;

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al realizar login',
      error: error.message
    });
  }
};

/**
 * Registro de nuevo usuario
 */
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;

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
      INSERT INTO usuarios (nombre, email, password, rol_id)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        id,
        nombre,
        email,
        rol_id,
        activo,
        ${sqlFormatDate('fecha_creacion')} as fecha_creacion
    `, [nombre, email, hashedPassword, rol_id || 3]); // Por defecto rol 3 (empleado)

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: newUser
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
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
    `, [req.userId]);

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
    console.error('Error en getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

/**
 * Cambiar contraseña
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    // Obtener contraseña actual del usuario
    const userResult = await db.query(
      'SELECT password FROM usuarios WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await db.query(
      'UPDATE usuarios SET password = $1, fecha_actualizacion = NOW() WHERE id = $2',
      [hashedPassword, req.userId]
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  changePassword
};
