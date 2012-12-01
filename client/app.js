define(["router", "views/app"],
function(router, AppView) {
  "use strict";
  
  router.start();
  
  window.app = new AppView();
  window.app.render();
});