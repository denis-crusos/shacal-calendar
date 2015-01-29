var express = require("express");
var SparqlClient = require("sparql-client");
var util = require("util");
var qtmp = require("../models/sparqls.js");

var router = express.Router();

router.get("/", function(req, res) {
	// var endpoint = "http://localhost:3030/tdb/query";
	// var query = "PREFIX ab: <http://learningsparql.com/ns/addressbook#>" +
	// 	"SELECT ?craigEmail" +
	// 	"WHERE" +
	// 	"{ ab:craig ab:email ?craigEmail . }" +
	// 	"LIMIT 10";
	// var client = new SparqlClient(endpoint);
	// client.query(query).execute(function(error, results) {
	// 	console.log(JSON.stringify(results, null, "\t"));
	// 	res.send(JSON.stringify(results, null, "\t"));
	// });

	var endpoint = "http://localhost:3030/tdb/update";
	var myquery = qtmp.addAnEventTo({
		person: "Denis", 
		evname:"event1", 
		startDate:"2015-01-23"
	});

	var client = new SparqlClient(endpoint);
	client.query(myquery).execute(function(error, results) {
		console.log(JSON.stringify(results, null, "\t"));
		res.send(JSON.stringify(results, null, "\t"));
	});

	// res.render("rdftest.jade", {title: "RdfTest Page"});
});

module.exports = router;

/*

	fuseki-server --update --loc=E:\Denis\FACULTATE\MSD2\DAW\FusekiDB /ds

	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?name
WHERE {
 ?person foaf:mbox <mailto:alice@example.org> .
 ?person foaf:name ?name .
}

fuseki-server --config=myTDBconfig.ttl
*/
