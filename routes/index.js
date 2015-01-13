var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var gapi = require("./gapi.js");

/* GET home page. */
var kittySchema = mongoose.Schema({
    name: String
});
var Kittens = mongoose.model('Kittens', kittySchema);
router.get("/", function(req, res) {
	mongoose.connect("mongodb://localhost/mydb");
	// mongoose.connect("mongodb://localhost/mydb", null, function(err){
	// 	if(err){
	// 		// return console.error.bind(console, "connection error: ");
	// 		return console.error("connection error: " + err);
	// 	}
	// 	console.log("connected to DB");
	// 	Kittens.find(function(err, cats){
	// 		if (err) return console.error(err);
	// 		console.log(JSON.stringify(cats, null, "\t"));
	// 		cone.close();
	// 	});
	// });
	var con = mongoose.connection;
	con.once("error", console.error.bind(console, "connection error:"));
	
	con.once("open", function(){
		console.log("connected to DB");
		// var Kittens = mongoose.model('Kittens');
		// var silence = new Kittens({ name: 'Silence' });
		// silence.save(function(err, cat){
		// 	if (err) return console.error(err);
		// 	console.log("Added a cat named " + cat.name);
		// });
		Kittens.find(function(err, cats){
			if (err) return console.error(err);
  			console.log(JSON.stringify(cats, null, "\t"));
  			con.close();
		});
		
	});
	con.once("close", function(){
		console.log("DB connection closed.");
	});
	console.log("REFRESH");
	res.render("index.jade", {
		title: "Express",
		url: gapi.url
	});
});

module.exports = router;
