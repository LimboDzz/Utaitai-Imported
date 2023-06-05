const express = require('express');
const router = express.Router();
module.exports = router;

const {
	getSettings,
	updateSettings,
} = require('../controllers/settingsController');

router.use(express.json());
router.get('/', getSettings);
router.patch('/', updateSettings);
