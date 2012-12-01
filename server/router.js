var neo4j = require("neo4j"),
db = new neo4j.GraphDatabase("http://localhost:7474");

var router = function(app) {
  app.get('/', function(req, res) {
    res.render("app");
  });

  app.post("/movies", function(req, res) {
    //console.log(req.body.title);
    var query = "START movie=node:Movie('id: *') \
		WHERE movie.title =~ {movieQuery} \
		RETURN movie as movie \
		LIMIT 100";

    var params = {
      movieQuery: ".*" + req.body.title + ".*"
    };

    db.query(query, params, function (err, results) {
      if (err) {
        throw err;
      }
	  //var response = new Buffer(results);
      res.send(results);
    });
  });

  app.get("/movies", function(req, res) {
    //console.log(req.query.title);
    var query = "START movie=node:Movie('id: *') \
		WHERE movie.title =~ {movieQuery} \
		RETURN movie as movie \
		LIMIT 100";

    var params = {
      movieQuery: ".*" + req.query.title + ".*"
    };

    db.query(query, params, function (err, results) {
      if (err) {
        throw err;
      }
      res.send(results);
    });
  });
};

exports = module.exports = router;