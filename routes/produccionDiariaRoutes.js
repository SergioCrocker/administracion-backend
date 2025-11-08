const express = require('express');
const router = express.Router();
const produccionDiariaController = require('../controllers/produccionDiariaController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', produccionDiariaController.getAll);
router.get('/:id', produccionDiariaController.getById);
router.post('/', produccionDiariaController.create);
router.put('/:id', produccionDiariaController.update);
router.delete('/:id', produccionDiariaController.remove);

module.exports = router;
