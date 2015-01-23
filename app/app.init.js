var _ = require('lodash');
require('./util/handlebars');

document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    var Router = require('./state/Router');
    var Database = require('./state/Database');

    window.app = { //_.extend({
        router: Router,
        db    : Database 
    };//}, window.app);

    app.router.init();
});
