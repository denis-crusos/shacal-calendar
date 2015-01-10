var googleapis = require("googleapis");
var OAuth2Client = googleapis.auth.OAuth2;
var client = "62316116173-69rnb3hd16omdp1l24s3vh6jf561p6nd.apps.googleusercontent.com";
var secret = "Mnq4TwfbzOnM_iAqGP7PRNQC";
var redirect = "http://localhost:3000/oauth2callback";
var calendar_auth_url = "";
var oauth2Client = new OAuth2Client(client, secret, redirect);

calendar_auth_url = oauth2Client.generateAuthUrl({
	access_type: "offline",
	scope: ["https://www.googleapis.com/auth/userinfo.email", 
		"https://www.googleapis.com/auth/userinfo.profile", 
		"https://www.googleapis.com/auth/plus.me",
		"https://www.googleapis.com/auth/calendar"]
});

exports.url = calendar_auth_url;
exports.client = oauth2Client;