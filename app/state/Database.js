var Dexie = require('dexie');
var initDb = require('./Database.init');

var db = new Dexie('crimperdb');

db.version(1).stores({
    locations: "++id,name",
    emojis   : "++id,&name",
    feelings : "++id,name,&emojiId",
    weeks    : "++id",
    days     : "++id,year,month,day,checkedIn",
    sessions : "++id,&dayId",
    attempts : "++id,gradeId,routeId,dayId",
    routes   : "++id,name,photoUrl,gradeId",
    grades   : "++id,name,systemName"
});

db.open();

initDb(db);

module.exports = db;