const express = require('express');
const router = express.Router();
module.exports = router;

const {
	getAllTracks,
	createOneTrack,
	getOneTrack,
	updateOneTrack,
	deleteOneTrack,
} = require('../controllers/trackController');

router.use(express.json());
router.get('/', getAllTracks);
router.post('/', createOneTrack);
router.get('/:key', getOneTrack);
router.patch('/:key', updateOneTrack);
router.delete('/:key', deleteOneTrack);
