var db = require('../state/Database');
var Q = require('kew');

function getDay(year, month, day) {
  var deferred = Q.defer();

  year = parseInt(year, 10);
  month = parseInt(month, 10);
  day = parseInt(day, 10);

  db.days
  .filter(function(dayEntry){
    return dayEntry.year === year &&
      dayEntry.month === month &&
      dayEntry.day === day;
  })
  .first(function(day){
    return deferred.resolve(day);
  });

  return deferred;
}

function checkIn(year, month, day, locationId, utime, feelingId, note) {
  // todo: handle errors, missing data
  var dayObj = {
    year : parseInt(year, 10),
    month : parseInt(month, 10),
    day : parseInt(day, 10),
    locationId : parseInt(locationId, 10),

    checkInTime : parseInt(utime, 10),
    checkInFeelingId : parseInt(feelingId, 10),
    checkInNote : note
  };

  return db.days
    .put(dayObj)
    .then(function(){
      return db.locations.update(dayObj.locationId, {
        lastUsed : dayObj.checkInTime
      });
    });
}

function checkOut(year, month, day, utime, feelingId, note) {
  // todo: handle errors
  return getDay(year, month, day)
    .then(function(dayObj){
      return db.days.update(dayObj.id, {
        checkOutTime : parseInt(utime, 10),
        checkOutFeelingId : parseInt(feelingId, 10),
        checkOutNote : note
      });
    });
}

function getRecentLocations() {
  return db.locations.toCollection().sortBy('lastUsed');
}


module.exports = {
  getDay : getDay,
  checkIn : checkIn,
  checkOut : checkOut,
  getRecentLocations : getRecentLocations
};
