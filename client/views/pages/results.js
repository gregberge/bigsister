define(["lib/views/page", "text!templates/pages/results.html", "views/elements/result-list", "collections/users", "models/user"],
function(PageView, template, ResultListView, UserCollection, UserModel) {
  "use strict";
  
  var View = PageView.extend({
    template: template,
    
    initialize: function() {
      PageView.prototype.initialize.call(this);
      
      this.users = new UserCollection();
      this.users.on("reset", this.render, this);
      this.users.fetch({data: this.options});
      this.resultListView = new ResultListView({users: this.users});
    },
    
    render: function() {
      PageView.prototype.render.call(this);
			var scores = [];
			for(var m in this.users.models){
				var child = this.users.models[m];
				scores.push(child.attributes.userScore)
			}
			var minScore = scores.sort(function(a,b){return a-b})[0];
			var maxScore = scores.reverse()[0];
			for(var m in this.users.models){
				var oldScore    = this.users.models[m].attributes.userScore;
				var newScore = 4-(4-1)*(oldScore-minScore)/(maxScore-minScore);
				this.users.models[m].set({ userScore: Math.floor(newScore) });
			}
			this.resultListView = new ResultListView({users: this.users});
      this.assign(this.resultListView, ".result-list");
    }
  });

  return View;
});