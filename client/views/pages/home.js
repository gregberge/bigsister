define(["lib/views/page", "text!templates/pages/home.html", "views/pages/results"],
function(PageView, template, ResultView) {
  "use strict";
  
  var View = PageView.extend({
    template: template,
    events: {
      "submit .search-form": "search",
      "click .search-form img": "search"
    },
    
    search: function() {
      var resultView = new ResultView({
        search: this.$(".search-form input").val()
      });
      
      resultView.render();
      
      return false;
    }
  });

  return View;
});