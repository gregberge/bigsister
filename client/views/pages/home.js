define(["lib/views/page", "text!templates/pages/home.html", "views/elements/results"],
function(PageView, template, ResultView) {
  "use strict";
  
  var View = PageView.extend({
    template: template,
	events: {
		"click #submit": "submit",
	},
	initialize: function (){
		PageView.prototype.initialize.call(this);
		this.resultView = new ResultView();
	},
	render: function (){
		PageView.prototype.render.call(this);
		this.assign(this.resultView, ".search-results");
	},
	submit: function() {
		var q = $("input[name='search-box']").val();
		this.resultView.movies.fetch({data: {"title":q}});
	}
  });

  return View;
});