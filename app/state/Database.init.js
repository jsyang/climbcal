var ajax = require('../util/tinyxhr');
var papa = require('babyparse');
var Q = require('kew');

var PARSE_OPTIONS = {
  header: true,
  delimiter:',',
  skipEmptyLines: true
};

function getDataAndPopulate(db, tableName) {
    return ajax('/assets/data/' + tableName + '.csv')
        .then(function(csv){
        if(csv){
          var rows = papa.parse(csv, PARSE_OPTIONS).data;
          db.createTableWithData(tableName, rows);
          return Q.resolve(undefined);
        }
      })
      .fail(function(e){
        console.log(e);
      });
}

function fillWithDefault(key, defaultValue) {
    var value = localStorage.getItem(key);
    if(value === null || value === undefined) {
        localStorage.setItem(key, defaultValue);
    }
}

function populateUserSettings(){
    fillWithDefault('preferredSystemName', 'Hueco');
}

function createEmptyTables(db) {
    var daySchema = [
        "year",
        "month",
        "day",
        "dateString",
        "locationName",
        "checkInTime",
        "checkInEmojiId",
        "checkInNote",
        "checkOutTime",
        "checkOutEmojiId",
        "checkOutNote"
    ];

    var climbSchema = [
        "dateString",
        "gradeId",
        "name",
        "value",
        "sequence"
    ];
    db.createTable('days', daySchema);
    db.createTable('climbs', climbSchema);
}

module.exports = function init(db) {
    var deferred = Q.defer();

    if(db.isNew()) {
        Q.all([
            getDataAndPopulate(db, 'locations'),
            getDataAndPopulate(db, 'grades'),
            getDataAndPopulate(db, 'emojis'),
            getDataAndPopulate(db, 'gradesystems')
        ])
            .then(function(){
                createEmptyTables(db);
            })
            .then(populateUserSettings)
            .then(function(){
                db.commit();
                deferred.resolve(undefined);
            });
    } else {
        deferred.resolve(undefined);
    }

    return deferred;
};
