const express = require('express')



const router = express.Router()

router.get('/', (req, res) => {
    res.json(req.user.settings)
})
// ? Create
router.post('/', async (req, res) => {
})
// ? Read
router.get('/:key', (req, res) => {
})
// ? Update
router.patch('/:key', (req, res) => {

})
// ? Delete
router.delete('/:key', async (req, res) => {
})

module.exports = router