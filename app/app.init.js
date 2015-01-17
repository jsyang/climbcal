var _ = require('lodash');
require('./util/handlebars');

document.addEventListener('DOMContentLoaded',function() {
  "use strict";

  var Router = require('./state/Router');

  window.app = _.extend({
    router : Router
  }, window.app);

  app.router.init();
});
