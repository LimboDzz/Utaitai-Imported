const mongoose = require('mongoose');
const trackSchema = require('./trackSchema');

module.exports = new mongoose.Schema({
	email: { type: String, required: true },
	name: { type: String, required: true },
	createAt: { type: Date, required: true, default: Date.now },
	trackList: [trackSchema],
	settings: {
		darkMode: { type: Boolean, default: false },
		volume: { type: Number, default: 0.1 },
		loop: { type: Boolean, default: false },
		autoplay: { type: Boolean, default: false },
		offset: { type: Number, default: 0 },
		lineFollow: { type: Boolean, default: false },
	},
	noteList: [
		{
			head: { type: String, required: true },
			body: { type: String, required: true },
			createAt: { type: Date, required: true, default: Date.now },
		},
	],
});
