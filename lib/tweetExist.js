var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var tweetExist = function(tweetId, callback) {
  var query = [
    "START tweet=node(*)",
    "WHERE tweet.twitter_id! = {tweetId}",
    "RETURN tweet"
  ].join('\n');

  db.query(query, {tweetId: tweetId}, function (err, results) {
    if(results.length > 0)
      return callback(results[0]['tweet']);
    else
      return callback(false);
  });
};

exports = tweetExist;
