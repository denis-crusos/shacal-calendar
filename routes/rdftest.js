var express = require("express");
var google = require("googleapis");
var mongoose = require("mongoose");
var Q = require("q");

var router = express.Router();

router.get("/", function(req, res) {
	res.render("rdftest.jade", {title: "RdfTest Page"});
});

module.exports = router;
