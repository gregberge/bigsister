var router = function(app) {
  app.get('/', function(req, res){
    res.render("app");
  });
};

exports = module.exports = router;