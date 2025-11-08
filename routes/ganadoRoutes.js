const express = require('express');
const router = express.Router();
const ganadoController = require('../controllers/ganadoController');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.get('/', ganadoController.getAll);
router.get('/:id', ganadoController.getById);
router.post('/', ganadoController.create);
router.put('/:id', ganadoController.update);
router.delete('/:id', ganadoController.remove);

module.exports = router;
