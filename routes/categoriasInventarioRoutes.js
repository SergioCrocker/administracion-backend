const express = require('express');
const router = express.Router();
const categoriasInventarioController = require('../controllers/categoriasInventarioController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', categoriasInventarioController.getAll);
router.get('/:id', categoriasInventarioController.getById);
router.post('/', categoriasInventarioController.create);
router.put('/:id', categoriasInventarioController.update);
router.delete('/:id', categoriasInventarioController.remove);

module.exports = router;
