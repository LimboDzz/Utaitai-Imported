// imports
const express = require('express');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
// ?Pass true to env() to make it use the current environment stage.
// ?serve node with the staging environment:
// ?NODE_ENV=staging node index.js
require('custom-env').env(true);
// local imports
const { User } = require('./models');
const blobRouter = require('./routes/blob');
const settingsRouter = require('./routes/settings');
const trackRouter = require('./routes/track');
const lyricRouter = require('./routes/lyric');
const noteRouter = require('./routes/note');
// env & const
const {
	PORT = 3000,
	MONGODB_URI,
	ACCESS_KEY_ID,
	SECRET_ACCESS_KEY,
	SECRET,
	BASE_URL,
	CLIENT_ID,
	ISSUER_BASE_URL,
} = process.env;
const authConfigs = {
	authRequired: false,
	auth0Logout: true,
	secret: SECRET,
	baseURL: BASE_URL,
	clientID: CLIENT_ID,
	issuerBaseURL: ISSUER_BASE_URL,
};
const baseURL = BASE_URL ?? `http://localhost:${PORT}`;

// ?create app & connect db
const app = express();
connectDB(MONGODB_URI);

// ?auth & use auth info to create user in db
app.use(auth(authConfigs));
app.use(createUserIfNotExists);

// ?routes
app.get('/', (req, res) => {
	req.oidc.isAuthenticated()
		? res.sendFile(path.resolve('frontend', 'index.html'))
		: res.sendFile(path.resolve('frontend', 'toAuth.html'));
});
app.get('/profile', requiresAuth(), (req, res) => {
	res.send(JSON.stringify(req.oidc.user));
});
app.use('/blob', blobRouter);
app.use('/settings', settingsRouter);
app.use('/track', trackRouter);
app.use('/lyric', lyricRouter);
app.use('/note', noteRouter);

app.use('/static', express.static(path.resolve('frontend')));
app.listen(PORT, () => console.log(`Serving at ${baseURL}`));

// ?functions
async function createUserIfNotExists(req, res, next) {
	if (req.oidc.isAuthenticated()) {
		let user = await User.findOne({ email: req.oidc.user.email });
		if (!user) user = await User.create(req.oidc.user);
		req.user = user;
		next();
	} else {
		next();
	}
}
function connectDB(MONGODB_URI) {
	mongoose.connect(MONGODB_URI);
	mongoose.connection.once('open', () => console.log('db connected'));
	mongoose.connection.on('error', () => console.log('db error'));
}
