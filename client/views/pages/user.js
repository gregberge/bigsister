define(["lib/views/page", "text!templates/pages/user.html", "models/user"],
function(PageView, template, UserModel) {
  "use strict";
  
  var View = PageView.extend({
    template: template,
    
    initialize: function() {
      PageView.prototype.initialize.call(this);
			console.log(this);
			console.log("this has been initialised")
    },

		render: function (){
			PageView.prototype.render.call(this);
			alert("surrender!");
			console.log(user);
		}
  });

  return View;
});