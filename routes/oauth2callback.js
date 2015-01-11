var express = require("express");
var google = require("googleapis");
var Q = require("q");
var _ = require("lodash");
var cal = google.calendar("v3");
var goauth2 = google.oauth2("v2");
var plus = google.plus("v1");
var router = express.Router();
var gapi = require("./gapi.js");

var oauth2Client = gapi.client;

/* GET home page. */
router.get("/", function(req, res) {
	var mycode = req.query.code;
	console.log(mycode);
	oauth2Client.getToken(mycode, function(err, tokens){
		if(!err) {
			// console.log(tokens);
			gapi.client.setCredentials(tokens);
			google.options({ auth: oauth2Client });

			var promises = [];
			promises.push(Q.nfcall(goauth2.userinfo.get, {userId: "me"}));
			promises.push(Q.nfcall(plus.people.get, {userId: "me"}));
			promises.push(Q.nfcall(cal.settings.list, {userId: "me"}));

			Q.allSettled(promises).spread(function(one, two, three){
				res.render("callbackpage.jade", {
					title: "The Callback page",
					code: mycode,
					first: JSON.stringify(one.value, null, "\t"),
					second: JSON.stringify(two.value, null, "\t"),
					third: JSON.stringify(three.value, null, "\t")
				});
			}).done(function(){
				console.log("\nAll 3 calls are done.");
			});


			// goauth2.userinfo.get({ userId: "me"}, function(err, results){
			// 	console.log("ME = " + JSON.stringify(results, null, "\t"));
			// });

			// plus.people.get({ userId: "me"}, function(err, user){
			// 	console.log("User = " + (err ? err.message : user));
			// });

			// cal.settings.list({userId: "me"}, function(err, rezults){
			// 	console.log("Call Settings = " + (err ? err.message : JSON.stringify(rezults, null, "\t")));
			// });
		}
	});
	// res.render("index.jade", {
	// 	title: "The Callback page",
	// 	code: mycode
	// });
});

module.exports = router;