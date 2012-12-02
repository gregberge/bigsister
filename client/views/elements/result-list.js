define(["lib/views/template", "text!templates/elements/result-list.html", "collections/users", "models/user", "views/pages/user"],
function(TemplateView, template, UserCollection, UserModel, UserView) {
  "use strict";

  var View = TemplateView.extend({
    template: template,
		
		events: {
      "click .user": "finduser"
    },
		
    initialize: function() {
      TemplateView.prototype.initialize.call(this);
    },
    render: function() {
      TemplateView.prototype.render.call(this);
    },

		finduser: function(event) {
			TemplateView.prototype.finduser.call(this);
			console.log($(event.target).attr("user"));
			this.user = new UserModel();
			this.user.on("reset", this.goToUser, this.user);
      this.user.fetch({data: {user: $(event.target).attr("user")}});
			this.userView = new UserView({user: this.user});
		},
		
		goToUser: function(){
			TemplateView.prototype.goToUser.call(this);
			alert("hellop");
		}
		
  });
	
  return View;
});