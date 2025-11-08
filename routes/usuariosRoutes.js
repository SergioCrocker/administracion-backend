const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Rutas públicas (ninguna - todas requieren autenticación)

// Rutas protegidas - requieren autenticación
router.get('/roles', verifyToken, usuariosController.getRoles);
router.get('/', verifyToken, usuariosController.getAll);
router.get('/:id', verifyToken, usuariosController.getById);

// Solo admins pueden crear, actualizar y eliminar usuarios
router.post('/', verifyToken, isAdmin, usuariosController.create);
router.put('/:id', verifyToken, isAdmin, usuariosController.update);
router.delete('/:id', verifyToken, isAdmin, usuariosController.remove);

module.exports = router;
