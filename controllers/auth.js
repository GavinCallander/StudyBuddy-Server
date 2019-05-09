require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const db = require('../models')

// POST /auth/login route - returns a JWT
router.post('/login', (req, res) => {
	console.log('In the POST /auth/login route');
	console.log(req.body);
	db.User.findOne({ email: req.body.email })
	.then(user => {
		// Make sure there is both a user and a password
		if (!user || !user.password) {
			return res.status(404).send({ message: 'User Not Found' })
		}
		// The user exists - now let's check their password
		if (!user.authenticated(req.body.password)) {
			// Invalid user credentials (bad password)
			return res.status(406).send({ message: 'Unacceptable' })
		}
		// Valid user, good password, now we need to give them a token
		const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
			expiresIn: 60 * 60 * 24 // 24 hours (in seconds)
		});
		// Send the token
		res.send({ token })
	})
	.catch((error) => {
		console.log('Error when finding user in POST /auth/login', error)
		return res.status(503).send({ message: 'Database Error' })
	})
});

// POST /auth/signup route - create a user in the DB and then log them in
router.post('/signup', (req, res) => {
	console.log('In the POST /auth/signup route');
	console.log(req.body);
  res.send('POST /auth/signup');
});

// This is what is returned when client queries for new user data
router.get('/current/user', (req, res) => {
  res.send('GET /auth/current/user STUB');
});

module.exports = router;
