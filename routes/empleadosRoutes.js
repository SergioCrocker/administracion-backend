const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleadosController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', empleadosController.getAll);
router.get('/:id', empleadosController.getById);
router.post('/', empleadosController.create);
router.put('/:id', empleadosController.update);
router.delete('/:id', empleadosController.remove);

module.exports = router;
