var express = require("express");
var SparqlClient = require("sparql-client");
var util = require("util");

var router = express.Router();

router.get("/", function(req, res) {
	var endpoint = "http://localhost:3030/ds/query";
	var query = "PREFIX ab: <http://learningsparql.com/ns/addressbook#>\nSELECT ?craigEmail\nWHERE\n{ ab:craig ab:email ?craigEmail . }\nLIMIT 10";
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		console.log(JSON.stringify(results, null, "\t"));
		res.send(JSON.stringify(results, null, "\t"));
	});
	// res.render("rdftest.jade", {title: "RdfTest Page"});
});

module.exports = router;
