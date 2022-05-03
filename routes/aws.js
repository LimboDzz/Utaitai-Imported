const express = require('express')
const multer = require('multer')
const fs = require('fs')

const { uploadToS3, downloadFromS3, deleteFromS3 } = require('../lib/S3')

const multerSingle = multer({ dest: 'temp/' }).single("file")

const router = express.Router()
// ? Create
router.post('/', multerSingle, async (req, res) => {
    try {
        // ! upload to S3
        const result = await uploadToS3(req.file)
        // ! unlink file in temp
        fs.unlink(req.file.path, err => console.log(err))
        // ! save track to DB
        addTrack(req.user, {
            name: req.file.originalname.split(".")[0],
            size: req.file.size,
            key: result.key
        }
        )
        // ! return S3 key
        res.json({ key: result.Key })
    } catch (error) {
        res.json({ msg: error.message })
    }
})
// ? Read
router.get('/:key', (req, res) => {
    const key = req.params.key
    const readStream = downloadFromS3(key)
    readStream.pipe(res)
})
// // Update
// ? Delete
router.delete('/:key', async (req, res) => {
    const key = req.params.key
    await deleteFromS3(key)
    delTrack(req.user, key)
    res.json({ msg: "deleteFromS3" })
})

module.exports = router

/**
 * add track to this user's trackList
 * @param {User} user 
 * @param {Object} track 
 */
async function addTrack(user, track) {
    user.trackList.push(track)
    await user.save()
}

/**
 * delete track from this user's trackList
 * @param {User} user 
 * @param {String} trackKey 
 */
async function delTrack(user, key) {
    user.trackList = user.trackList.filter(track => track.key != key)
    await user.save()
}