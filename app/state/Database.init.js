var ajax = require('../util/tinyxhr');
var papa = require('babyparse');

var PARSE_OPTIONS = { header: true, delimiter:','};

function getDataAndPopulate(db, tableName) {
    return ajax('/assets/data/' + tableName + '.csv')
        .then(function(csv){
            var table = db[tableName];
            var rows = papa.parse(csv, PARSE_OPTIONS).data;

            table.clear();

            function populate() {
                rows.forEach(function(entry){ table.add(entry); });
            }

            return db.transaction("rw", table, populate).catch(console.log.bind(console));
        });
}

module.exports = function initDb(db) {
    return getDataAndPopulate(db, 'locations')
        .then(function(){
            return getDataAndPopulate(db, 'grades');
        })
        .then(function(){
            return getDataAndPopulate(db, 'emojis');
        })
        .then(function(){
            return getDataAndPopulate(db, 'feelings');
        });
};