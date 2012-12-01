define(["jquery", "lib/views/base", "views/elements/menu"],
function($, BaseView, MenuView) {
  "use strict";

  var View = BaseView.extend({

    el: $("body"),

    initialize: function() {
      BaseView.prototype.initialize.call(this);
      this.menu = new MenuView();
    },

    render: function(data) {
      BaseView.prototype.render.call(this, data);
      this.assign(this.menu, "#menu");
    }

  });

  return View;
});
