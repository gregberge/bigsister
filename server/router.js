var WorkerRequest = require("./worker-request").WorkerRequest,
neo4j = require('neo4j'),
db = new neo4j.GraphDatabase('http://localhost:7474');

var router = function(app) {
  
  var workers = {
    
  };
  
  app.get('/', function(req, res) {
    res.render("app");
  });
  
  app.get("/users", function(req, res) {
    var workerRequest = new WorkerRequest();
    workerRequest.res = res;
    workerRequest.request(req.query.search, function() {
      workers[workerRequest.id] = workerRequest;
    });
  });
  
  app.post("/finish-request", function(req, res) {
    
    var workerRequest = workers[req.body.id];
    
    var query = 'START root=node(' + req.body.parentNodeId + ') \
    MATCH p=root-[ins:insight|tweet*..2]->tweet-[:author]->author \
    WHERE \
    	tweet.type="tweet" \
    RETURN \
    	author.name as name, \
    	author.user as user, \
    	SUM(COALESCE(HEAD(EXTRACT(i in ins : i.weight?)), 100)) as userScore, \
        COUNT(DISTINCT tweet) as matchCount, \
    	COUNT(DISTINCT tweet.text) as tweetCount \
    ORDER BY userScore DESC';
    
    db.query(query, {}, function(err, results) {
      workerRequest.res.send(results);
      res.send(200, "OK");
    });
  });
};

exports = module.exports = router;