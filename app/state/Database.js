var Dexie = require('dexie');
var init = require('./Database.init');

var db = new Dexie('crimperdb');

var schema = {
  locations: "++id,&name",
  emojis   : "++id,&name",
  feelings : "++id,&name,&emojiId",
  days     : "++id,year,month,day",
  climbs   : "++id,gradeId,dayId",
  routes   : "++id,name,gradeId",
  grades   : "++id,name,gradeSystemName",
  sports   : "++id,name"
};

db.version(1).stores(schema);

db.init = init.bind(this, db);

module.exports = db;
