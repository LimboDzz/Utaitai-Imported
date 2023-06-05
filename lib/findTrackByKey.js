function findTrackByKey(req, key) {
	const track = req.user.trackList.find(track => track.key == key);
	req.track = track;
}
exports.findTrackByKey = findTrackByKey;
