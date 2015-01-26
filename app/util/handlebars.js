var handlebars = require('hbsfy/runtime');
var getTime = require('./time');
var ClimbEntry = require('../view/widget/ClimbEntry');

handlebars.registerHelper('currentTime', getTime);
handlebars.registerPartial('climbEntries', function(entries, options){
    var html = "";

    entries
        .sort(function(a,b){
            return a.value - b.value;
        })
        .forEach(function(entry){
            html += ClimbEntry.render(entry);
        });

    return html;
});