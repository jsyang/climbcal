var Dexie = require('dexie');
var initDb = require('./Database.init');

var db = new Dexie('crimperdb');

var schema = {
  locations: "++id,&name",
  emojis   : "++id,&name",
  feelings : "++id,&name,&emojiId",
  days     : "++id,year,month,day",
  attempts : "++id,gradeId,routeId,dayId",
  routes   : "++id,name,gradeId",
  grades   : "++id,name,systemName"
};

db.version(1).stores(schema);
db.open();

initDb(db);

db.clearAllTables = function() {
  Object.keys(schema).forEach(function(table){
    db[table].clear();
  });
};

module.exports = db;