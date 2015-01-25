var ajax = require('../util/tinyxhr');
var papa = require('babyparse');
var Q = require('kew');

var PARSE_OPTIONS = {
  header: true,
  delimiter:',',
  skipEmptyLines: true
};

function getDataAndPopulate(db, tableName) {
    return db[tableName].count()
      .then(function(count){
        if(count > 0) {
          return Q.reject(undefined);
        } else {
          return ajax('/assets/data/' + tableName + '.csv');
        }
      })
      .then(function(csv){
          var table = db[tableName];
          var rows = papa.parse(csv, PARSE_OPTIONS).data;

          function populate() {
              rows.forEach(function(entry){ table.add(entry); });
          }

          return db.transaction("rw", table, populate).catch(console.log.bind(console));
      });
}

// todo: wait for the data to be populated before the rest of the app initializes
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
        })
        .then(function(){
            return getDataAndPopulate(db, 'sports');
        });
};
