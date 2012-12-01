define(["lib/views/page", "text!templates/pages/results.html", "views/elements/result-list"],
function(PageView, template, ResultListView) {
  "use strict";
  
  var View = PageView.extend({
    template: template,
    
    initialize: function() {
      PageView.prototype.initialize.call(this);
      this.resultListView = new ResultListView();
    },
    
    render: function() {
      PageView.prototype.render.call(this);
      this.assign(this.resultListView, ".result-list");
    }
  });

  return View;
});