const express = require('express');
const router = express.Router();
const historicoSaludController = require('../controllers/historicoSaludController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', historicoSaludController.getAll);
router.get('/:id', historicoSaludController.getById);
router.post('/', historicoSaludController.create);
router.put('/:id', historicoSaludController.update);
router.delete('/:id', historicoSaludController.remove);

module.exports = router;
