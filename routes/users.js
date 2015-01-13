var express = require("express");
var mongoose = require("mongoose");
var google = require("googleapis");
var Q = require("q");

var goauth2 = google.oauth2("v2");
var router = express.Router();

var gapi = require("./gapi.js");
var oauth2Client = gapi.client;
var usersModel = require("../models/usersModel.js");

/* GET users listing. */
router.get("/:id", function(req, res) {
	mongoose.connect("mongodb://localhost/mydb");
	var con = mongoose.connection;
	con.once("error", console.error.bind(console, "connection error:"));
	con.once("open", function(){
		usersModel.findById(req.params.id, function(err, user){
			if(err) res.send(err);
			var tokens = {};
			tokens.access_token = user.access_token;
			tokens.token_type = user.token_type;
			tokens.id_token = user.id_token;
			tokens.expiry_date = user.expiry_date;

			oauth2Client.setCredentials(tokens);
			google.options({ auth: oauth2Client });

			Q.nfcall(goauth2.userinfo.get, {userId: "me"}).then(function(response){
				res.render("users.jade", {
					user: user.name,
					stuff: JSON.stringify(user, null, "\t"),
					userinfo: JSON.stringify(response, null, "\t")
				});
			});
			con.close();
		});
	});
	con.once("close", function(){
		console.log("DB connection closed.");
	});
});

module.exports = router;
