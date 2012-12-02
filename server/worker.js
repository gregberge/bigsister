
var crawlInsights, crawlTweets, createNode, db, decRequest, incRequest, jobs, kue, neo4j, redis, redisClient, twit, Twitter, util;

neo4j = require('neo4j');

Twitter = require('twitter');

kue = require('kue');

util = require('util');

jobs = kue.createQueue();

db = new neo4j.GraphDatabase('http://localhost:7474');

kue.app.listen(3000);

redis = require('redis');

var request = require("request");

redisClient = redis.createClient();

var tweetExist = require('../lib/tweetExist');
var userExist = require('../lib/userExist');

twit = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

crawlInsights = function(text, callback) {
  console.log("Crawl insights for: " + text);
  return callback([['ipad', 10], ['iphone', 30]]);
};

crawlTweets = function(text, callback) {
  console.log("Crawl tweets for: " + text);
  return twit.search(text, function(results) {
    return callback(results.results);
  });
};

incRequest = function(requestId, inc, callback) {

  if (typeof inc === "undefined") {
    inc = 1;
  }

  return redisClient.incrby("request:counter:" + requestId, inc, callback);
};

decRequest = function(requestId, inc, callback) {

  if (typeof inc === "undefined") {
    inc = 1;
  }

  return redisClient.decrby("request:counter:" + requestId, inc, callback);
};

var getCounter = function(requestId, callback) {
  return redisClient.get("request:counter:" + requestId, callback);
};

createNode = function(data, depth, requestId, parentNodeId, callback) {
  
  return db.createNode(data).save(function(err, node) {
    if(parentNodeId === null) {
      parentNodeId = node.id;
    }
    
    jobs.create('expand:node', {
      requestId: requestId,
      nodeId: node.id,
      depth: depth + 1,
      parentNodeId : parentNodeId
      }).save();
      return callback(err, node);
    });
  };

  jobs.process('expand:node', function(job, done) {
    return db.getNodeById(job.data.nodeId, function(err, node) {
      if (err === null) {
        var end = true;

        if (node.data.type === 'text') {
          if (job.data.depth === 1) {
            crawlInsights(node.data.text, function(insights) {
              decRequest(job.data.requestId, 1, function() {
                incRequest(job.data.requestId, insights.length, function() {
                  return insights.forEach(function(insight) {
                    return createNode({
                      type: 'text',
                      text: insight[0]
                    }, job.data.depth + 1, job.data.requestId, job.data.parentNodeId, function(err, insightNode) {
                      return node.createRelationshipTo(insightNode, 'insight', {
                        weight: insight[1]
                      });
                    });
                  });
                });
              });
            });

          }

          crawlTweets(node.data.text, function(tweets) {
            decRequest(job.data.requestId, 1, function() {
              incRequest(job.data.requestId, tweets.length, function() {
                incRequest(job.data.requestId, tweets.length, function() {
                  return tweets.forEach(function(tweet) {

                    // return existing node if tweet is already in the database
                    tweetExist(tweet.id, function(tweetNode) {
                      node.createRelationshipTo(tweetNode, 'tweet');
                      jobs.create('expand:node', {
                        requestId: job.data.requestId,
                        nodeId: tweetNode.id,
                        depth: job.data.depth + 1,
                        parentNodeId : job.data.parentNodeId
                        }).save();
                      return tweetNode;
                    }, function() {
                      return createNode({
                        type: 'tweet',
                        text: tweet.text,
                        twitter_id: tweet.id
                      }, job.data.depth + 1, job.data.requestId, job.data.parentNodeId, function(err, tweetNode) {
                        node.createRelationshipTo(tweetNode, 'tweet');

                        // return existing node if tweet is already in the database
                        userExist(tweet.from_user_name, function(userNode) {
                          tweetNode.createRelationshipTo(userNode, 'author');
                          jobs.create('expand:node', {
                            requestId: job.data.requestId,
                            nodeId: userNode.id,
                            depth: job.data.depth + 1,
                            parentNodeId : job.data.parentNodeId
                            }).save();
                          return userNode;
                        }, function () {
                          return createNode({
                            type: 'user',
                            name: tweet.from_user_name
                          }, job.data.depth + 1, job.data.requestId, job.data.parentNodeId, function(err, userNode) {
                            return tweetNode.createRelationshipTo(userNode, 'author');
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });

          end = false;
        }

        if(end) {
          decRequest(job.data.requestId, 1, function() {
            getCounter(job.data.requestId, function(err, counter) {

              console.log(counter);

              if (counter <= 0) {
                console.log("FINI");
                request.post("http://localhost:3001/finish-request").form({id: job.data.requestId, parentNodeId: job.data.parentNodeId});
              }
            });
          });
        }

        return done();
      }
    });
  });

  var requestT = function(text, requestId) {
    incRequest(requestId, 2, function() {
      return createNode({
        type: 'text',
        text: text
      }, 0, requestId, null, function(err, node) {
        return jobs.create('expand:node:text', {
          requestId: requestId,
          nodeId: node.id,
          depth: 0
          }).save();
        });
      });

    };

    jobs.process('new:request', function(job, done) {
      console.log("new request");
      requestT(job.data.text, job.data.requestId);
      return done();
    });
