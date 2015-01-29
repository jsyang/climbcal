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
            if(seqString) {
              var wins = seqString.match(/1/g);
              wins = wins? wins.length : 0;
              entry.percent = wins / seqString.length * 100;
            } else {
              entry.percent = 100;
              entry.nodata = true;
            }

            html += ClimbEntry.render(entry);
        });

    return html;
});
