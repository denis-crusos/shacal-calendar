var _ = require("lodash");

var many_querys = {};

many_querys.findFriendsOf = _.template(
	"PREFIX users:     <http://localhost:3000/users/>" +
	"PREFIX foaf:      <http://xmlns.com/foaf/0.1/>" +

	"SELECT <%= varname%>" +
	"WHERE" +

	"{" +

	"users:<%= person %> foaf:knows ?who ." +
	"?who foaf:name <%= varname %> ." +

	"}"
);

many_querys.findEventsOf = _.template(
	"PREFIX users:     <http://localhost:3000/users/>" +
	"PREFIX events:  <http://localhost:3000/events/>" +
	"PREFIX schema:     <http://schema.org/>" +
	"PREFIX foaf:      <http://xmlns.com/foaf/0.1/>" +

	"SELECT <%= evname %> <%= evstart %>" +
	"WHERE" +
	"{" +

	"users:<%= person %> users:hasEvent ?what ." +
	"?what schema:name <%= evname %> ." +
	"?what schema:startDate <%= evstart %> ." +

	"}"
);

many_querys.addAnEventTo = _.template(
	"PREFIX users:     <http://localhost:3000/users/>" +
	"PREFIX events:  <http://localhost:3000/events/>" +
	"PREFIX schema:     <http://schema.org/>" +

	"INSERT DATA {" +

	"events:<%= evname %> a schema:Event ." +
	"events:<%= evname %> schema:name '<%= evanme %>' ." +
	"events:<%= evname %> schema:startDate '<%= startDate %>' ." +
	"users:<%= person %> users:hasEvent events:<%= evname %> ." +

	"}"
);

many_querys.addCustomEventTo = _.template(
	"PREFIX users:     <http://localhost:3000/users/>" +
	"PREFIX events:  <http://localhost:3000/events/>" +
	"PREFIX schema:     <http://schema.org/>" +

	"INSERT DATA {" +

	"events:<%= evname %> a schema:<%= evtype %> ." +
	"events:<%= evname %> schema:name '<%= evanme %>' ." +
	"events:<%= evname %> schema:startDate '<%= startDate %>' ." +
	"users:<%= person %> users:hasEvent events:<%= evname %> ." +

	"}"
);

many_querys.addUser = _.template(
	"PREFIX users:     <http://localhost:3000/users/>" +
	"PREFIX foaf:      <http://xmlns.com/foaf/0.1/>" +

	"INSERT DATA {" +

	"users:<%= person %> a foaf:Person ." +
    "users:<%= person %> foaf:name '<%= person %>' ." +

	"}"
);

many_querys.addFriendTo = _.template(
	"PREFIX users:     <http://localhost:3000/users/>" +
	"PREFIX foaf:      <http://xmlns.com/foaf/0.1/>" +

	"INSERT DATA {" +

	"users:<%= person %> foaf:knows [" +
        "a foaf:Person ;" +
        "foaf:name '<%= friend %>'" +
    "] ."

	"}"
);

many_querys.addEndDateToEvent = _.template(
	"PREFIX events:  <http://localhost:3000/events/>" +
	"PREFIX schema:  <http://schema.org/>" +

	"INSERT DATA {" +

	"events:<%= evname %> schema:endDate '<%= endDate %>' ." +

	"}"
);

many_querys.addUrlToEvent = _.template(
	"PREFIX events:  <http://localhost:3000/events/>" +
	"PREFIX schema:  <http://schema.org/>" +

	"INSERT DATA {" +

	"events:<%= evname %> schema:url '<%= url %>' ." +

	"}"
);

many_querys.addLocationToEvent = _.template(
	"PREFIX events:  <http://localhost:3000/events/>" +
	"PREFIX schema:  <http://schema.org/>" +

	"INSERT DATA {" +

	"events:<%= evname %> schema:location '<%= location %>' ." +

	"}"
);

many_querys.addDescriptionToEvent = _.template(
	"PREFIX events:  <http://localhost:3000/events/>" +
	"PREFIX schema:  <http://schema.org/>" +

	"INSERT DATA {" +

	"events:<%= evname %> schema:description '<%= desc %>' ." +

	"}"
);

module.exports = many_querys;