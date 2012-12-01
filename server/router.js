var neo4j = require("neo4j"),
db = new neo4j.GraphDatabase("http://localhost:7474");

var router = function(app) {
  app.get('/', function(req, res) {
    res.render("app");
  });
  
  app.get("/test/", function(req, res) {
    
    var query = [
      'START user=node({userId})',
      'MATCH (user) -[:likes]-> (other)',
      'RETURN other'
    ].join('\n');

    var params = {
      userId: 5
    };
    
    

    db.query(query, params, function (err, results) {
      if (err) {
        throw err;
      }
      res.end(results);
    });
    
  });
};

exports = module.exports = router;