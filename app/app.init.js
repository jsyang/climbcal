var _ = require('lodash');

document.addEventListener('DOMContentLoaded',function() {
  "use strict";

  var AppRouter = require('./state/Router');

  window.app = _.extend({
    router : AppRouter
  }, window.app);

  app.router.init();
});
