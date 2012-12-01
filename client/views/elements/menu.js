define(["lib/views/template", "text!templates/elements/menu.html", "router"],
function(TemplateView, template, router) {
  "use strict";
  
  var View = TemplateView.extend({
    template: template,
    
    selectedTab: "home",
    
    initialize: function() {
      TemplateView.prototype.initialize.call(this);
      router.on("all", this.routeChange, this);
    },
    
    render: function() {
      TemplateView.prototype.render.call(this);
      this.$(".nav li").removeClass("active");
      this.$(".nav li[data-name=" + this.selectedTab + "]").addClass("active");
    },
    
    routeChange: function(route) {
      if(typeof route !== "undefined") {
        var name = route.match(/:(.*)/)[1];
        this.selectedTab = name;
        this.render();
      }
    }
  });
  
  return View;
});