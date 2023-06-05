const { Lrc } = require('lrc-kit');
const encoding = require('encoding');
const { findTrackByKey } = require('../lib/findTrackByKey');

const getOneLyric = (req, res) => {
	findTrackByKey(req, req.params.key);
	res.json({ lyrics: req.track.lyrics, offset: req.track.offset });
};
const createOneLyric = async (req, res) => {
	// ?covert to utf8 from GB2312
	const buffer = encoding.convert(req.file.buffer, 'utf8', 'GB2312');
	// ?Lrc.parse(str)
	const lyrics = Lrc.parse(buffer.toString()).lyrics;
	// ?find the corresponding track and save on it
	const trackList = req.user.trackList;
	const key = req.body.key;
	const track = trackList.find(track => track.key == key);
	track.lyrics = lyrics;
	try {
		await req.user.save();
	} catch (error) {
		res.json({ msg: 'err: fail to save lyric' });
	}
	res.json({ lyrics, offset: track.offset });
};
const updateOneLyric = () => {};

module.exports = {
	getOneLyric,
	createOneLyric,
	updateOneLyric,
};
