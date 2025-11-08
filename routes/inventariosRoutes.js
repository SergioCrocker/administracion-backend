const express = require('express');
const router = express.Router();
const inventariosController = require('../controllers/inventariosController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', inventariosController.getAll);
router.get('/:id', inventariosController.getById);
router.post('/', inventariosController.create);
router.put('/:id', inventariosController.update);
router.delete('/:id', inventariosController.remove);

module.exports = router;
