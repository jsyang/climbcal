var ajax = require('../util/tinyxhr');
var papa = require('babyparse');
var Q = require('kew');

var PARSE_OPTIONS = {
  header: true,
  delimiter:',',
  skipEmptyLines: true
};

function getDataAndPopulate(db, tableName) {
    var table = db[tableName];
    return table.count()
      .then(function(count){
        if(count > 0) {
          return Q.resolve(undefined);
        } else {
          return ajax('/assets/data/' + tableName + '.csv');
        }
      })
      .then(function(csv){
        if(csv){
          var rows = papa.parse(csv, PARSE_OPTIONS).data;
          return db.transaction("rw", table, function populate() {
            rows.forEach(function(entry){ table.add(entry); });
          });
        } else {
          return Q.resolve(undefined);
        }
      })
      .catch(function(e){
        console.log(e);
      });
}

function fillWithDefault(key, defaultValue) {
    var value = localStorage.getItem(key);
    if(value === null || value === undefined) {
        localStorage.setItem(key, defaultValue);
    }
}

function populateLocalStorage(){
    fillWithDefault('preferredSystemName', 'Hueco');
}

module.exports = function init(db) {
    var deferred = Q.defer();

    db.on('ready', function(){
      return Q.all([
        getDataAndPopulate(db, 'locations'),
        getDataAndPopulate(db, 'grades'),
        getDataAndPopulate(db, 'emojis'),
        getDataAndPopulate(db, 'feelings'),
        getDataAndPopulate(db, 'gradesystems'),
        getDataAndPopulate(db, 'sports')
      ])
      .then(populateLocalStorage)
      .then(function(){
        deferred.resolve(undefined);
      });
    });

    db.open();

    return deferred;
};
