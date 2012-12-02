neo4j = require('neo4j'),
db = new neo4j.GraphDatabase('http://localhost:7474');
var jsonxml = require('jsontoxml');

var router = function(app) {
  
  var workers = {
    
  };
  
  app.get('/', function(req, res) {
    res.render("app");
  });
  
  app.get("/users", function(req, res) {
	  console.log(req.query.search);
	
    var query = 'START root=node(*) \
		MATCH p=root-[ins:insight|tweet*..2]->tweet-[:author]->author \
		WHERE \
			has(root.type) \
			AND root.type="text" \
			AND (root.text=~{searchQuery}) \
			AND tweet.type="tweet" \
		RETURN \
			author.name as name, \
			SUM(COALESCE(HEAD(EXTRACT(i in ins : i.weight?)), 100)) as userScore, \
		  COUNT(DISTINCT tweet) as matchCount, \
			COUNT(DISTINCT tweet.text) as tweetCount \
		ORDER BY userScore DESC';
    
		var params = {
			searchQuery: ".*" + req.query.search + ".*"
		};

    db.query(query, params, function(err, results) {
			res.send(results)
    });

	  /*var workerRequest = new WorkerRequest();
    workerRequest.res = res;
    workerRequest.request(req.query.search, function() {
      workers[workerRequest.id] = workerRequest;
    });*/
  });
  
  /*app.post("/finish-request", function(req, res) {
    
    var workerRequest = workers[req.body.id];
    
    var query = 'START root=node(' + req.body.parentNodeId + ') \
    MATCH p=root-[ins:insight|tweet*..2]->tweet-[:author]->author \
    WHERE \
    	tweet.type="tweet" \
    RETURN \
    	author.name as name, \
    	SUM(COALESCE(HEAD(EXTRACT(i in ins : i.weight?)), 100)) as userScore, \
        COUNT(DISTINCT tweet) as matchCount, \
    	COUNT(DISTINCT tweet.text) as tweetCount \
    ORDER BY userScore DESC';
    
    db.query(query, {}, function(err, results) {
      workerRequest.res.send(results);
    });
    
  });*/

	app.post("/user", function(req, res) {
	  console.log(req.body.user);
	
    var query = 'START author=node(*) \
		MATCH author<-[:author]-tweet \
		WHERE has(author.name) AND author.name = {user} \
		RETURN DISTINCT author.name, tweet.text';
    
		var params = {
			user: req.body.user
		};

    db.query(query, params, function(err, results) {
			var object = {};
			for(var r in results){
				object[r] = results[r]
			}
			var xml = jsonxml(object);

			//console.log(xml);
			res.send(results)
    });
  });

	app.get("/user", function(req, res) {
	  console.log(req.query.user);
	
    var query = 'START author=node(*) \
		MATCH author<-[:author]-tweet \
		WHERE has(author.name) AND author.name = {user} \
		RETURN DISTINCT author.name as name, COLLECT(tweet.text) as tweets';
    
		var params = {
			user: req.query.user
		};

    db.query(query, params, function(err, results) {
			var object = {};
			for(var r in results){
				object[r] = results[r]
			}
			var xml = jsonxml(object);

			//console.log(xml);
			res.send(results[0])
    });
  });

	app.get("/graph", function(req, res))
};

exports = module.exports = router;