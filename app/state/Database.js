var Dexie = require('dexie');
var initDb = require('./Database.init');

var db = new Dexie('crimperdb');

db.version(1).stores({
    locations: "++id,name",
    emojis   : "++id,&name",
    feelings : "++id,name,emojiName",
    weeks    : "++id",
    days     : "++id,utime,feelingId",
    attempts : "++id,grade,routeId",
    routes   : "++id,name,photoUrl,grade",
    grades   : "++id,name"
});

db.open();

initDb(db);

module.exports = db;