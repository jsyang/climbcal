require('./util/tracking.js')();
var alertError = require('./util/alertError');
var fullscreen = require('./util/fullscreen');

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
        })
        .fail(alertError);
});
