define(["lib/views/page", "text!templates/pages/results.html", "views/elements/result-list", "collections/users"],
function(PageView, template, ResultListView, UserCollection) {
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
      this.assign(this.resultListView, ".result-list");
    }
  });

  return View;
});