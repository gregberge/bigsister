define(["lib/views/template", "text!templates/elements/menu.html", "router"],
function(TemplateView, template, router) {
  "use strict";
  
  var View = TemplateView.extend({
    template: template,
    
    page: "home",
    
    initialize: function() {
      TemplateView.prototype.initialize.call(this);
      router.on("all", this.routeChange, this);
    },
    
    render: function() {
      TemplateView.prototype.render.call(this);
      this.$(".nav li").removeClass("active");
      this.$(".nav li[data-page=" + this.page + "]").addClass("active");
      
      if(this.page === "results") {
        this.$el.addClass("search-enabled");
      }
      else {
        this.$el.removeClass("search-enabled");
      }
      
    },
    
    routeChange: function(route) {
      if(typeof route !== "undefined") {
        var name = route.match(/:(.*)/)[1];
        this.page = name;
        this.render();
      }
    }
  });
  
  return View;
});