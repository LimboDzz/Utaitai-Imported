//#region imports
const express = require('express')
const dotenv = require('dotenv').config()
const path = require('path')
const { auth, requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');

const User = require('./models/User');
const awsRouter = require('./routes/aws');
const settingsRouter = require('./routes/settings');
const trackRouter = require('./routes/track');
const lyricRouter = require('./routes/lyric');
const noteRouter = require('./routes/note');

const PORT = process.env.PORT ?? 3000
const app = express()

connectDB()
use()

// ?req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    req.oidc.isAuthenticated()
        ? res.sendFile(path.resolve("frontend", "index.html"))
        : res.sendFile(path.resolve("frontend", "toAuth.html"))
})

// ?routes
app.use('/aws', awsRouter)
app.use('/settings', settingsRouter)
app.use('/track', trackRouter)
app.use('/lyric', lyricRouter)
app.use('/note', noteRouter)







app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user))
})




// ?serving at ...
app.listen(PORT, () => console.log(`Serving at http://localhost:${PORT}`))

function connectDB() {
    mongoose.connect("mongodb://localhost/0430")
    mongoose.connection.once('open', () => console.log("db connected"))
    mongoose.connection.on('error', () => console.log("db error"))
}
function use() {
    const config = {
        authRequired: false,
        auth0Logout: true,
        secret: 'a long, randomly-generated string stored in env',
        baseURL: 'http://localhost:3000',
        clientID: 'iTUC3I6DytQw6EtkNGCk3IQDaWssHRmz',
        issuerBaseURL: 'https://dev-49q6dx8y.us.auth0.com'
    };
    app.use("/static", express.static(path.resolve("frontend")))
    // ?auth router attaches /login, /logout, and /callback routes to the baseURL
    app.use(auth(config))
    app.use(userInit)
}
async function userInit(req, res, next) {
    if (req.oidc.isAuthenticated()) {
        let user = await User.findOne({ email: req.oidc.user.email })
        if (!user)
            user = await User.create(req.oidc.user)
        req.user = user
        next()
    } else {
        next()
    }
}