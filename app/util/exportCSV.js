var db = require('../state/Database');
var Q = require('kew');
var papa = require('babyparse');
var JSZip = require('jszip');
var FileSaver = require('filesaver');

module.exports = function exportDays() {
    var deferred = Q.defer();

    Q.all([
        db.days.toArray(),
        db.climbs.filter(function(climb){
            return climb.sequence.length > 0;
        }).toArray(),
        db.grades.toArray(),
        db.locations.toArray(),
        db.emojis.toArray()
    ])
    .then(function(data){
        var zipfile = new JSZip();

        var days = data[0];
        var climbs = data[1];
        var grades = data[2];
        var locations = data[3];
        var emojis = data[4];

        zipfile.file('days.csv', papa.unparse(days));
        zipfile.file('climbs.csv', papa.unparse(climbs)); 
        zipfile.file('grades.csv', papa.unparse(grades));
        zipfile.file('locations.csv', papa.unparse(locations));
        zipfile.file('emojis.csv', papa.unparse(emojis));

        FileSaver(
            zipfile.generate({type:"blob"}),
            "crimper.csv.zip"
        );

        deferred.resolve();
    });

    return deferred;
};
