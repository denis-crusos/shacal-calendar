var express = require("express");
var mongoose = require("mongoose");
var google = require("googleapis");
var Q = require("q");
var _ = require("lodash");

var qtmp = require("../models/sparqls.js");
var SparqlClient = require("sparql-client");

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
			console.log(JSON.stringify(user, null, "\t"));
			tokens.access_token = user.access_token;
			tokens.token_type = user.token_type;
			tokens.id_token = user.id_token;
			tokens.expiry_date = user.expiry_date;

			oauth2Client.setCredentials(tokens);
			google.options({ auth: oauth2Client });

			//Check if it exists in RDF
			var queryname = user.name.split(" ");
			queryname = queryname[0] + queryname[1];
			var myquery = qtmp.findUserName({
				person: queryname, 
				username: "UserName"
			});
			// console.log(myquery);
			var rdfclient = new SparqlClient("http://localhost:3030/tdb/query");
			rdfclient.query(myquery).execute(function(error, results) {
				// console.log(JSON.stringify(results, null, "\t"));
				// res.send(JSON.stringify(results, null, "\t"));
				var value = _.pluck(results.results.bindings[0], "value");
				var ceva = _.include(value, queryname);
				//If it exists add the new user
				if (!_.include(results.results.bindings[0], queryname)){
					var add_user = qtmp.addUser({
						person: queryname
					});
					var rdfadder = new SparqlClient("http://localhost:3030/tdb/update");
					rdfadder.query(add_user).execute(function(err, succ){
						if (err) console.log("RDF Error: \n" + err);
						console.log("Added: " + queryname);
					});
				}
			});

			// Get the events of that user
			var eventsquery = qtmp.findEventsOf({
				person: queryname,
				evname: "evname",
				evstart: "evstart"
			});
			rdfclient.query(eventsquery).execute(function(err, results){
				console.log(JSON.stringify(results, null, "\t"));
				var actualrez = results.results.bindings;
				var the_events = _.reduce(actualrez, function(acm, item, key){
					var thing = {};
					thing.EventName = item.evname.value;
					thing.StartDate = item.evstart.value;
					acm.push(thing);
					return acm;
				}, []);

				res.render("users.jade", {
					user: user.name,
					events: the_events
				});
			});


			// Q.nfcall(goauth2.userinfo.get, {userId: "me"}).then(function(response){
			// 	res.render("users.jade", {
			// 		user: user.name,
			// 		stuff: JSON.stringify(user, null, "\t"),
			// 		picture: user.picture,
			// 		userinfo: JSON.stringify(response, null, "\t")
			// 	});
			// }, function(err){
			// 	res.render("users.jade", {
			// 		user: user.name,
			// 		picture: user.picture,
			// 		stuff: JSON.stringify(err, null, "\t"),
			// 	});
			// });
			con.close();
		});
	});
	con.once("close", function(){
		console.log("DB connection closed.");
	});
});

module.exports = router;
