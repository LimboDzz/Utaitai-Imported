const express = require('express')



const router = express.Router()
// !parse body as json
router.use(express.json())

router.get('/', (req, res) => {
    res.json(req.user.trackList)
})
// ? Create
router.post('/', async (req, res) => {
})
// ? Read
router.get('/:key', (req, res) => {
})
// ? Update
router.patch('/:key', getTrack, async (req, res) => {
    req.track.offset = req.body.offset ?? req.track.offset
    console.log(req.body.offset);
    req.track.name = req.body.name ?? req.track.name
    req.track.author = req.body.author ?? req.track.author
    req.track.tags = req.body.tags ?? req.track.tags
    try {
        await req.user.save()
    } catch (error) {
        res.json({ msg: "err: fail to update track/offset info" })
    }
    res.json({})
})
// ? Delete
router.delete('/:key', async (req, res) => {
    const key = req.params.key
    req.user.trackList = req.user.trackList.filter(track => track.key != key)
    try {
        await req.user.save()
    } catch (error) {
        res.json({ msg: "err: fail to delete track" })
    }
    res.json({})
})

module.exports = router

function getTrack(req, res, next) {
    const key = req.params.key
    const track = req.user.trackList.find(track => track.key == key)
    req.track = track
    next()
}