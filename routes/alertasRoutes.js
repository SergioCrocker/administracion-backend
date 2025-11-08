const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', alertasController.getAll);
router.get('/:id', alertasController.getById);
router.post('/', alertasController.create);
router.put('/:id', alertasController.update);
router.delete('/:id', alertasController.remove);

module.exports = router;
