var express = require("express");
var router = express.Router();
var gapi = require("./gapi.js");

/* GET home page. */
router.get("/", function(req, res) {
	res.render("index.jade", {
		title: "Express",
		url: gapi.url
	});
});

module.exports = router;
