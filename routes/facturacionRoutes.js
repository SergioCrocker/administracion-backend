const express = require('express');
const router = express.Router();
const facturacionController = require('../controllers/facturacionController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', facturacionController.getAll);
router.get('/:id', facturacionController.getById);
router.post('/', facturacionController.create);
router.put('/:id', facturacionController.update);
router.delete('/:id', facturacionController.remove);

module.exports = router;
