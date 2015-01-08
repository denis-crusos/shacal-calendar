require(["dojo/dom", "dojo/query", "dojo/dom-construct", "dojo/request", "dojo/domReady!"], 
	function(dom, query, domConstruct, request){
		request.get("/API/google_oauth").then(
		function(res){
			domConstruct.create("a", {href: res.url, innerHTML: "Click me!"}, "mydiv");
		},
		function(err){
			domConstruct.create("h1", {innerHTML: "Error!"}, "mydiv");
			console.log(err);
		});
});