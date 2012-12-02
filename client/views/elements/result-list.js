define(["lib/views/template", "text!templates/elements/result-list.html", "collections/users"],
function(TemplateView, template, UserCollection) {
  "use strict";

  var View = TemplateView.extend({
    template: template,

    initialize: function() {
      TemplateView.prototype.initialize.call(this);
    },
    render: function() {
      TemplateView.prototype.render.call(this);
    },
  });

  return View;
});