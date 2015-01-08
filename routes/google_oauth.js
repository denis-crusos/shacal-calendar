var express = require('express');
var google = require('googleapis');
var router = express.Router();

var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');

var CLIENT_ID = 'YOUR CLIENT ID HERE';
var CLIENT_SECRET = 'YOUR CLIENT SECRET HERE';
var REDIRECT_URL = 'YOUR REDIRECT URL HERE';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

router.get("/", function(req, res){

	function getAccessToken(oauth2Client, callback) {
		// generate consent page url
		var url = oauth2Client.generateAuthUrl({
			access_type: 'offline', // will return a refresh token
			scope: 'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
		});

		console.log('Visit the url: ', url);
		rl.question('Enter the code here:', function(code) {
			// request access token
			oauth2Client.getToken(code, function(err, tokens) {
				// set tokens to the client
				// TODO: tokens should be set by OAuth2 client.
				oauth2Client.setCredentials(tokens);
				callback();
			});
		});
	}

	// retrieve an access token
	getAccessToken(oauth2Client, function() {
		// retrieve user profile
		plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
			if (err) {
				console.log('An error occured', err);
				return;
			}
			console.log(profile.displayName, ':', profile.tagline);
		});
	});

	res.render("register", {title:"Register"});
});

module.exports = router;