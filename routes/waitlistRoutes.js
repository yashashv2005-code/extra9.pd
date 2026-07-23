const express = require('express');
const { param } = require('express-validator');
const controller = require('../controllers/waitlistController');
const validate = require('../middleware/validation');
const { createRules, updateRules } = require('../validators/waitlistValidators');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/search/:game', param('game').trim().notEmpty().withMessage('game is required'), validate, controller.search);
router.get('/status/:status', param('status').isIn(['waiting', 'approved', 'rejected']).withMessage('status must be waiting, approved, or rejected'), validate, controller.byStatus);
router.get('/:id', controller.getOne);
router.post('/', createRules, validate, controller.create);
router.put('/:id', updateRules, validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
