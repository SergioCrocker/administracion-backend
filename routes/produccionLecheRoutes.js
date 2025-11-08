const express = require('express');
const router = express.Router();
const produccionLecheController = require('../controllers/produccionLecheController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', produccionLecheController.getAll);
router.get('/:id', produccionLecheController.getById);
router.post('/', produccionLecheController.create);
router.put('/:id', produccionLecheController.update);
router.delete('/:id', produccionLecheController.remove);

module.exports = router;
