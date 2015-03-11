var db = require('../state/Database');
var papa = require('babyparse');
var JSZip = require('jszip');
var FileSaver = require('filesaver');

module.exports = function exportDays() {
    var zipfile = new JSZip();

    var days = db.query('days');
    var climbs = db.query('climbs', function(climb) {
        return climb.sequence.length !== 0;
    });
    var grades = db.query('grades');
    var locations = db.query('locations');
    var emojis = db.query('emojis');

    zipfile.file('days.csv', papa.unparse(days));
    zipfile.file('climbs.csv', papa.unparse(climbs));
    zipfile.file('grades.csv', papa.unparse(grades));
    zipfile.file('locations.csv', papa.unparse(locations));
    zipfile.file('emojis.csv', papa.unparse(emojis));

    FileSaver(
        zipfile.generate({type:"blob"}),
        "crimper.csv.zip"
    );
};
