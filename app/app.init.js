require('./util/handlebars');

document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    var Router = require('./state/Router');
    var Database = require('./state/Database');

    var app = {
        router: Router,
        db    : Database
    };

    app.db.init()
      .then(function(){
        app.router.init();
        window.app = app;
      });
});
