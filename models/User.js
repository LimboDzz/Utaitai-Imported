const mongoose = require('mongoose')

const trackSchema = new mongoose.Schema({
    key: { type: String, required: true },
    name: { type: String, required: true },
    author: { type: String, default: "Unknown" },
    size: { type: Number },
    createAt: { type: Date, required: true, default: Date.now },
    tags: [String],
    lyrics: [{ timestamp: Number, content: String }],
    offset: { type: Number, default: 0 }
})

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    createAt: { type: Date, required: true, default: Date.now },
    trackList: [trackSchema],
    settings: {
        darkMode: { type: String, default: false },
        volume: { type: Number, default: 0.1 },
        loop: { type: Boolean, default: false },
        autoplay: { type: Boolean, default: false },
        offset: { type: Number, default: 300 },
        lineFollow: { type: Boolean, default: false }
    },
    noteList: [{
        head: { type: String, required: true },
        body: { type: String, required: true },
        createAt: { type: Date, required: true, default: Date.now }
    }]
})

module.exports = mongoose.model("User", userSchema)