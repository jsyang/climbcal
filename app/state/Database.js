var localStorageDB = require('localStorageDB');
var init = require('./Database.init');

var db = new localStorageDB('crimperdb', localStorage);
db.init = init.bind(this, db);
module.exports = db;
