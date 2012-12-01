define(["lib/views/template", "text!templates/elements/result-list.html", "collections/users"],
function(TemplateView, template, UserCollection) {
  "use strict";

  var View = TemplateView.extend({
    template: template,

    initialize: function() {
      TemplateView.prototype.initialize.call(this);
      this.users = new UserCollection();
      this.users.on("reset", this.render, this);
    }
  });

  return View;
});