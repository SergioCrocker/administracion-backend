const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

// Rutas CRUD de ejemplo
router.get('/', exampleController.getAll);
router.get('/:id', exampleController.getById);
router.post('/', exampleController.create);
router.put('/:id', exampleController.update);
router.delete('/:id', exampleController.remove);

module.exports = router;
