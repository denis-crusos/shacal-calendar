var express = require('express');
var google = require('googleapis');
var router = express.Router();

router.get("/", function(req, res){
	res.render("register", {title:"Register"});
	// changed
});

router.post("/",function(req, res){
	var to_send = {};
	to_send.message = "Success!";
	to_send.url = "/API/google_oauth";
	res.json(to_send);
});

module.exports = router;