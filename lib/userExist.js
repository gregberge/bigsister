var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var userExist = function(twitterUid, callback) {
  var query = [
    "START user=node(*)",
    "WHERE user.twitter_uid! = {twitterUid}",
    "RETURN user"
  ].join('\n');

  db.query(query, {twitterUid: twitterUid}, function (err, results) {
    if(results.length > 0)
      return callback(results[0]['user']);
    else
      return callback(false);
  });
};

exports = userExist;
