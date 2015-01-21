var ajax = require('../util/tinyxhr');
var papa = require('babyparse');

var PARSE_OPTIONS = { header: true, delimiter:','};

module.exports = function initDb(db) {

    var locations;

    ajax('/assets/data/locations.csv')
        .then(function(csv){
            locations = papa.parse(csv, PARSE_OPTIONS).data;
        })
        .then(function(){
            db.transaction("rw", db.locations, function () {
                db.locations.clear();
                locations.forEach(function(loc){
                    db.locations.add(loc);
                });
            }).catch(function (e) {
                console.log(e, "error");
            });
        });


};