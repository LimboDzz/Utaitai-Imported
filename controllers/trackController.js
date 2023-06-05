const { findTrackByKey } = require('../lib/findTrackByKey');

const getAllTracks = (req, res) => {
	res.json(req.user.trackList);
};
const updateOneTrack = async (req, res) => {
	findTrackByKey(req, req.params.key);
	req.track.name = req.body.name ?? req.track.name;
	req.track.author = req.body.author ?? req.track.author;
	req.track.tags = req.body.tags ?? req.track.tags;
	try {
		await req.user.save();
	} catch (error) {
		res.json({ msg: 'err: fail to update track/offset info' });
	}
	res.json({});
};
const deleteOneTrack = async (req, res) => {
	const key = req.params.key;
	req.user.trackList = req.user.trackList.filter(track => track.key != key);
	try {
		await req.user.save();
	} catch (error) {
		res.json({ msg: 'err: fail to delete track' });
	}
	res.json({});
};
const createOneTrack = () => {};
const getOneTrack = () => {};

module.exports = {
	getAllTracks,
	updateOneTrack,
	createOneTrack,
	getOneTrack,
	deleteOneTrack,
};
