define(["lib/views/template", "text!templates/elements/results.html", "collections/movies"],
function(TemplateView, template, MovieCollection) {
  "use strict";
  
  var View = TemplateView.extend({
    template: template,
    
    initialize: function() {
      TemplateView.prototype.initialize.call(this);
	  	this.movies = new MovieCollection();
	  	this.movies.on("reset", this.render, this);
    }
  });
  
  return View;
});