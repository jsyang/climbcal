var handlebars = require('hbsfy/runtime');
var getTime = require('./time');

handlebars.registerHelper('currentTime', getTime);
