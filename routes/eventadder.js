var express = require("express");
var SparqlClient = require("sparql-client");
var qtmp = require("../models/sparqls.js");
var _ = require("lodash");

var router = express.Router();

router.post("/", function(req, res) {
	console.log(JSON.stringify(req.body, null, "\t"));
	console.log(JSON.stringify(req.cookies, null, "\t"));

	if(_.has(req.cookies, "username")){
		var person = req.cookies.username.split(" ");
		person = _.reduce(person, function(acm, item, key){
			return acm + item;
		}, "");
		var rdfclient = new SparqlClient("http://localhost:3030/tdb/update");

		
		// if(_.has(req.body, "eventtype")){
		// 	var evtype = req.body.eventtype;
		// 	evtype = _.reduce(evtype, function(acm, item, key){
		// 		return acm + item;
		// 	}, "");
		// 	var myquery = qtmp.addCustomEventTo({
		// 		person: person, 
		// 		evname: req.body.eventname, 
		// 		evtype: evtype,
		// 		startDate: req.body.eventstart
		// 	});
		// 	rdfclient.query(myquery).execute(function(error, results) {
		// 		if(!error){
		// 			console.log("Event: " + req.body.eventname + " + " + evtype);
		// 		}else{
		// 			console.log("Err - addCustomEventTo " + error);
		// 		}
		// 	});
		// }else{
			var myquery = qtmp.addAnEventTo({
				person: person, 
				evname: req.body.eventname, 
				startDate: req.body.eventstart
			});
			rdfclient.query(myquery).execute(function(error, results) {
				if(!error){
					console.log("Event: " + req.body.eventname + " added.");
				}else{
					console.log("Err - addAnEventTo " + error);
				}
			});
		// }

		if(req.body.eventloc !== ""){
			var myquery = qtmp.addLocationToEvent({
				evname: req.body.eventname, 
				location: req.body.eventloc
			});
			rdfclient.query(myquery).execute(function(error, results) {
				if(!error){
					console.log("Event: " + req.body.eventname + " added + Location: " + req.body.eventloc);
				}else{
					console.log("Err - addLocationToEvent " + error);
				}
			});
		}
		
		if(req.body.eventdesc !== ""){
			var myquery = qtmp.addDescriptionToEvent({
				evname: req.body.eventname, 
				desc: req.body.eventdesc
			});
			rdfclient.query(myquery).execute(function(error, results) {
				if(!error){
					console.log("Event: " + req.body.eventname + " added + Description: " + req.body.eventdesc);
				}else{
					console.log("Err - addDescriptionToEvent " + error);
				}
			});
		}

		if(req.body.eventend !== ""){
			var myquery = qtmp.addEndDateToEvent({
				evname: req.body.eventname, 
				endDate: req.body.eventend
			});
			rdfclient.query(myquery).execute(function(error, results) {
				if(!error){
					console.log("Event: " + req.body.eventname + " added + Enddate: " + req.body.eventend);
				}else{
					console.log("Err - addEndDateToEvent " + error);
				}
			});
		}

		if(req.body.eventprivacy !== ""){
			var myquery = qtmp.addPrivacyToEvent({
				evname: req.body.eventname, 
				privacy: req.body.eventprivacy
			});
			rdfclient.query(myquery).execute(function(error, results) {
				if(!error){
					console.log("Event: " + req.body.eventname + " added + privacy: " + req.body.eventprivacy);
				}else{
					console.log("Err - addPrivacyToEvent " + error);
				}
			});
		}

		res.redirect("/users/" + req.cookies.userid);
		// res.redirect("/");
	}else{
		res.redirect("/");
	}
});

module.exports = router;