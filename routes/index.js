var express = require("express");
// var mongoose = require("mongoose");
var router = express.Router();
var gapi = require("./gapi.js");

/* GET home page. */
// var kittySchema = mongoose.Schema({
//     name: String
// });
// var Kittens = mongoose.model('Kittens', kittySchema);
router.get("/", function(req, res) {
	res.render("index.jade", {
		title: "Express",
		url: gapi.url
	});
});

module.exports = router;
