var express = require("express");
var google = require("googleapis");
var mongoose = require("mongoose");
var Q = require("q");
var _ = require("lodash");

var cal = google.calendar("v3");
var goauth2 = google.oauth2("v2");
var plus = google.plus("v1");
var router = express.Router();

var gapi = require("./gapi.js");
var userModel = require("../models/usersModel.js");

var oauth2Client = gapi.client;

/* GET home page. */
router.get("/", function(req, res) {
	var mycode = req.query.code;
	console.log(mycode);
	oauth2Client.getToken(mycode, function(err, tokens){
		if(!err) {
			console.log(tokens);
			oauth2Client.setCredentials(tokens);
			google.options({ auth: oauth2Client });

			var promises = [];
			promises.push(Q.nfcall(goauth2.userinfo.get, {userId: "me"}));
			// promises.push(Q.nfcall(plus.people.get, {userId: "me"}));
			// promises.push(Q.nfcall(cal.settings.list, {userId: "me"}));

			// call and set a cookie
			Q.nfcall(goauth2.userinfo.get, {userId: "me"}).then(function(response){
				var namearr = _.pluck(response, "name");
				// console.log(JSON.stringify(namearr, null, "\t"));
				res.cookie("username", namearr[0], { maxAge: 900000 });
				// res.cookie("userid", );
			});

			Q.allSettled(promises).spread(function(one /*, two, three*/){
				// Spit out the HTML
				// res.render("callbackpage.jade", {
				// 	title: "The Callback page",
				// 	code: mycode,
				// 	tok: JSON.stringify(tokens, null, "\t"),
				// 	first: JSON.stringify(one.value, null, "\t")
				// 	// second: JSON.stringify(two.value, null, "\t"),
				// 	// third: JSON.stringify(three.value, null, "\t")
				// });

				// Create a entry in the database
				mongoose.connect("mongodb://localhost/mydb");
				var con = mongoose.connection;
				con.once("error", console.error.bind(console, "connection error:"));
				con.once("open", function(){
					console.log("connected to DB");
					var newUser = new userModel({ 
						name: one.value[0].name,
					    access_token: tokens.access_token,
					    token_type: tokens.token_type,
					    id_token: tokens.id_token,
					    expiry_date: tokens.expiry_date,
					    code: mycode 
					});
					userModel.find({name: one.value[0].name}, function(err, users){
						if (err) return console.error(err);
						// console.log(JSON.stringify(users, null, "\t"));
						if (users.length === 0){
							newUser.save(function(err, user){
								if (err) return console.error(err);
								console.log("Added a new user named " + user.name);
								con.close();
								console.log("Cookie in callback with userid: " + user._id);
								res.cookie("userid", user._id, { maxAge: 900000 });
								console.log("Sending browser to : " + "/users/" + user._id);
								res.redirect("/users/" + user._id);
							});
						} else {
							console.log("User already exists.");
							con.close();
							console.log("Cookie with userid: " + users[0]._id);
							res.cookie("userid", users[0]._id, { maxAge: 900000 });
							console.log("Sending browser to : " + "/users/" + users[0]._id);
							res.redirect("/users/" + users[0]._id);
						}
					});
				});
				con.once("close", function(){
					console.log("DB connection closed.");
				});
			}).done(function(){
				console.log("\nAll 3 calls are done.");
			});

		}
	});
});

module.exports = router;