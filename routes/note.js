const express = require('express');
const router = express.Router();
module.exports = router;
const {
	deleteOneNote,
	createOneNote,
	getAllNotes,
} = require('../controllers/noteController');

router.use(express.json());
router.get('/', getAllNotes);
router.post('/', createOneNote);
router.delete('/:_id', deleteOneNote);
