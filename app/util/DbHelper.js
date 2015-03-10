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
  var dayObj = {
    year : parseInt(year, 10),
    month : parseInt(month, 10),
    day : parseInt(day, 10),
    locationId : parseInt(locationId, 10),

    checkInTime : parseInt(utime, 10),
    checkInFeelingId : parseInt(feelingId, 10),
    checkInNote : note
  };

  var dayId;
  var preferredSystemName = localStorage.getItem('preferredSystemName');

  return db.days
    .put(dayObj)
    .then(function(id){
      dayId = id;

      return db.locations.update(dayObj.locationId, {
        lastUsed : dayObj.checkInTime
      });
    })
    .then(function(){
        return db.grades.where('systemName').equals(preferredSystemName)
            .each(function(grade){
                db.climbs.put({
                    dayId : dayId,
                    gradeId : grade.id,
                    name : grade.name,
                    value : grade.value,
                    sequence : []
                });
            });
    });
}

function checkOut(year, month, day, utime, feelingId, note) {
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

function getClimbsByDayId(id) {
  return db.climbs
    .filter(function(climbEntry){
      return climbEntry.dayId === id;
    })
    .sortBy('value');
}

function getGradesBySystem(systemName) {
  return db.grades
    .where('systemName')
    .equalsIgnoreCase(systemName)
    .sortBy('value');
}

function getLocation(name) {
    return db.query('locations', function caseInsensitive(row) {
        return row.name.toLowerCase() === name.toLowerCase();
    });
}

function getGradeSystems() {
    return Q.resolve(db.queryAll('gradesystems', {}));
}

function getClimbedDays(month, year) {
    if(typeof month !== 'undefined' && typeof year !== 'undefined' ) {
        return Q.resolve(db.queryAll('days', {
            month : month,
            year : year
        }));
    } else {
        return Q.reject(new Error('No month or year given to find climbed days!'));
    }
}

module.exports = {
    getLocation : getLocation,
    getGradeSystems : getGradeSystems,
    getClimbedDays : getClimbedDays,

    getDay : getDay,
    checkIn : checkIn,
    checkOut : checkOut,
    getRecentLocations : getRecentLocations,
    getClimbsByDayId : getClimbsByDayId,
    getGradesBySystem : getGradesBySystem
};
