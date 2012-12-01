neo4j = require 'neo4j'
twitter = require 'twitter'
kue = require 'kue'
util = require 'util'
jobs = kue.createQueue()
_ = require 'underscore'
db = new neo4j.GraphDatabase 'http://localhost:7474'
kue.app.listen 3000
redis = require 'redis'
redisClient = redis.createClient()

twit = new twitter
  consumer_key: process.env.TWITTER_CONSUMER_KEY
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET
  access_token_key: process.env.TWITTER_ACCESS_TOKEN
  access_token_secret: process.env.TWITTER_TOKEN_SECRET

# google trends
crawlInsights = (text, callback) ->
  console.log "Crawl insights for: #{text}"
  callback([['ipad', 10], ['iphone', 30]])

crawlTweets = (text, callback) ->
  console.log "Crawl tweets for: #{text}"
  twit.search text, (results) ->
    callback(results.results)

# expand text
jobs.process 'expand:node:text', (job, done) ->
  db.getNodeById job.data.nodeId, (err, node) ->
    unless err?
      # insights
      if job.data.depth == 0
        crawlInsights node.data.text, (insights) ->
          insights.forEach (insight) ->
            db.createNode(type: 'text', text: insight[0]).save (err, insightNode) ->
              node.createRelationshipTo insightNode, 'insight', weight: insight[1]
              jobs.create('expand:node:text',
                requestId: job.data.requestId
                nodeId: insightNode.id
                depth: job.data.depth + 1
                ).save()
      # tweets
      crawlTweets node.data.text, (tweets) ->
        tweets.forEach (tweet) ->
          db.createNode(type: 'tweet', text: tweet.text, twitter_id: tweet.id).save (err, tweetNode) ->
            node.createRelationshipTo tweetNode, 'tweet'
            db.createNode(type: 'user', name: tweet.from_user_name).save (err, userNode) ->
              console.log "#{userNode.id} - #{userNode.data.name}"
              tweetNode.createRelationshipTo userNode, 'author'
      done()

request = (text) ->
  requestId = redisClient.incr('next_request_id')
  db.createNode(type: 'text', text: text).save (err, node) ->
    jobs.create('expand:node:text',
      requestId: requestId
      nodeId: node.id
      depth: 0
      ).save()

request 'apple'
