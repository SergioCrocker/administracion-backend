const express = require('express');
const router = express.Router();
const historicoProduccionController = require('../controllers/historicoProduccionController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', historicoProduccionController.getAll);
router.get('/:id', historicoProduccionController.getById);
router.post('/', historicoProduccionController.create);
router.put('/:id', historicoProduccionController.update);
router.delete('/:id', historicoProduccionController.remove);

module.exports = router;
