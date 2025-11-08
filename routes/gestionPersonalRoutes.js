const express = require('express');
const router = express.Router();
const gestionPersonalController = require('../controllers/gestionPersonalController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', gestionPersonalController.getAll);
router.get('/:id', gestionPersonalController.getById);
router.post('/', gestionPersonalController.create);
router.put('/:id', gestionPersonalController.update);
router.delete('/:id', gestionPersonalController.remove);

module.exports = router;
