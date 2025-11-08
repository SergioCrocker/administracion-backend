const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ventasController.getAll);
router.get('/:id', ventasController.getById);
router.post('/', ventasController.create);
router.put('/:id', ventasController.update);
router.delete('/:id', ventasController.remove);

module.exports = router;
