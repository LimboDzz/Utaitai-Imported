const express = require('express')



const router = express.Router()
router.use(express.json())
router.get('/', (req, res) => {
    res.json(req.user.settings)
})
router.patch('/', async (req, res) => {
    const { name, value } = req.body
    req.user.settings[name] = value
    try {
        await req.user.save()
        res.json({})

    } catch (error) {
        res.json({ msg: error.message })
    }
})
module.exports = router