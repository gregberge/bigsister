define(["lib/views/page", "text!templates/pages/about.html", "collections/movies"],
function(PageView, template, MovieCollection) {
  "use strict";
  
  var View = PageView.extend({
    template: template,
	initialize: function() {
		PageView.prototype.initialize.call(this);
		this.movies = new MovieCollection();
		this.movies.fetch({data: {"title":"Ring"}}).then(this.render.bind(this));
	}
  });
  
  return View;
});