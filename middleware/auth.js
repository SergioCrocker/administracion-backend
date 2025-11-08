const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT
 */
const verifyToken = (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];
    
    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }

    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }
      
      // Guardar información del usuario en la request
      req.userId = decoded.id;
      req.userEmail = decoded.email;
      req.userRole = decoded.role;
      
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar token',
      error: error.message
    });
  }
};

/**
 * Middleware para verificar roles específicos
 */
const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({
        success: false,
        message: 'No se pudo verificar el rol del usuario'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
        requiredRoles: allowedRoles,
        yourRole: req.userRole
      });
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario es administrador
 */
const isAdmin = (req, res, next) => {
  return verifyRole('admin')(req, res, next);
};

/**
 * Middleware para verificar si el usuario es admin o supervisor
 */
const isAdminOrSupervisor = (req, res, next) => {
  return verifyRole('admin', 'supervisor')(req, res, next);
};

module.exports = {
  verifyToken,
  verifyRole,
  isAdmin,
  isAdminOrSupervisor
};
