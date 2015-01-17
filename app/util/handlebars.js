var handlebars = require('hbsfy/runtime');
var getTime = require('./time');

handlebars.registerHelper('allLocations', function (options) {
  return [
    'Mile End Climbing Wall',
    'Cafe Kraft',
    'Klimmuur Hollands Spoor',
    'FLASHH',
    'Ostbloc'
  ].map(function (name) {
    return options.fn({
      'name' : name
    });
  }).join('');
});

handlebars.registerHelper('currentTime', getTime);
