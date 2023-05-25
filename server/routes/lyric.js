const express = require('express')
const { Lrc } = require('lrc-kit')
const multer = require('multer')
const fs = require('fs/promises')
const encoding = require('encoding')

// !to enable req.file.buffer using memoryStorage
const storage = multer.memoryStorage()
const multerSingle = multer({ storage }).single("file")

const router = express.Router()

// ? Create
router.post('/', multerSingle, async (req, res) => {
    // !covert to utf8 from GB2312
    const buffer = encoding.convert(req.file.buffer, "utf8", "GB2312")
    // !Lrc.parse(str)
    const lyrics = Lrc.parse(buffer.toString()).lyrics
    // !find the corresponding track and save on it
    const trackList = req.user.trackList
    const key = req.body.key
    const track = trackList.find(track => track.key == key)
    track.lyrics = lyrics
    try {
        await req.user.save()
    } catch (error) {
        res.json({ msg: "err: fail to save lyric" })
    }
    res.json({ lyrics, offset: track.offset })
})
// ? Read
router.get('/:key', getTrack, (req, res) => {
    res.json({ lyrics: req.track.lyrics, offset: req.track.offset })
})
// ? Update
router.patch('/:key', getTrack, async (req, res) => {
    // todo
    try {
        await req.user.save()
    } catch (error) {
        res.json({ msg: "err: fail to save lyric" })
    }
    res.json({})
})
// // Delete

module.exports = router

function getTrack(req, res, next) {
    const key = req.params.key
    const track = req.user.trackList.find(track => track.key == key)
    req.track = track
    next()
}