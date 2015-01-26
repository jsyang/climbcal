var handlebars = require('hbsfy/runtime');
var getTime = require('./time');
var ClimbEntry = require('../view/widget/ClimbEntry');

handlebars.registerHelper('currentTime', getTime);

handlebars.registerHelper('climbEntries', function(entries, options){
    var html = "";

    entries
        .sort(function(a, b){
            return b.value - a.value;
        })
        .forEach(function(entry){
            var seqString = entry.sequence.join('');
            var wins = seqString.match(/1/g).length;
            entry.percent = wins / seqString.length * 100;

            html += ClimbEntry.render(entry);
        });

    return html;
});
