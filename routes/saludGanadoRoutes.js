const express = require('express');
const router = express.Router();
const saludGanadoController = require('../controllers/saludGanadoController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', saludGanadoController.getAll);
router.get('/:id', saludGanadoController.getById);
router.post('/', saludGanadoController.create);
router.put('/:id', saludGanadoController.update);
router.delete('/:id', saludGanadoController.remove);

module.exports = router;
