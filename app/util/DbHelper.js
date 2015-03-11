var db = require('../state/Database');
var Q = require('kew');

function getDay(year, month, day) {
    year = parseInt(year, 10);
    month = parseInt(month, 10);
    day = parseInt(day, 10);

    return Q.resolve(db.query('days', {
        year: year,
        month: month,
        day: day
    })[0]);
}

function checkIn(year, month, day, locationName, utime, emojiId, note) {
    var dayObj = {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        locationName: locationName,

        checkInTime: parseInt(utime, 10),
        checkInEmojiId: parseInt(emojiId, 10),
        checkInNote: note
    };

    dayObj.dateString = dayObj.day + '/' + dayObj.month + '/' + dayObj.year;

    var preferredSystemName = localStorage.getItem('preferredSystemName');

    db.insert('days', dayObj);
    db.update('locations', {name: locationName}, function (loc) {
        loc.lastUsed = dayObj.checkInTime.toString();
        return loc;
    });

    var grades = db.queryAll('grades', {
        query: {systemName: preferredSystemName},
        sort: [['value', 'DESC']]
    });

    grades.forEach(function (grade) {
        db.insert('climbs', {
            dateString: dayObj.dateString,
            gradeId: grade.ID,
            name: grade.name,
            value: grade.value,
            sequence: []
        });
    });

    db.commit();

    return Q.resolve(dayObj);
}

function checkOut(year, month, day, utime, emojiId, note) {
    return getDay(year, month, day)
        .then(function (dayObj) {
            db.update('days', {ID: dayObj.ID}, function (day) {
                day.checkOutTime = parseInt(utime, 10);
                day.checkOutEmojiId = parseInt(emojiId, 10);
                day.checkOutNote = note;
                return day;
            });

            db.commit();
            return true;
        });
}

function getRecentLocations() {
    return Q.resolve(db.queryAll(
        'locations',
        {sort: [['lastUsed', 'DESC']]}
    ));
}

function getClimbsByDate(year, month, day) {
    return Q.resolve(db.queryAll('climbs', {
        query: {
            dateString: day + '/' + month + '/' + year
        },
        sort: [
            ['value', 'DESC']
        ]
    }));
}

function getLocation(name) {
    return db.query('locations', function caseInsensitive(row) {
        return row.name.toLowerCase() === name.toLowerCase();
    });
}

function getGradeSystems() {
    return Q.resolve(db.query('gradesystems'));
}

function getClimbedDays(month, year) {
    if (typeof month !== 'undefined' && typeof year !== 'undefined') {
        return Q.resolve(db.query('days', {
            month: month,
            year: year
        }));
    } else {
        return Q.reject(new Error('No month or year given to find climbed days!'));
    }
}

function createNewLocation(locationObj) {
    db.insertOrUpdate('locations', {name: locationObj.name}, locationObj);
    db.commit();
    return Q.resolve(true);
}

function getEmojis() {
    return Q.resolve(db.query('emojis'));
}

function getLocationNameByDate(year, month, day) {
    return getDay(year, month, day)
        .then(function (day) {
            return day && day.locationName;
        });
}

function deleteRecord(id) {
    id = parseInt(id, 10);
    var sequence = db.query("climbs", {ID: id})[0].sequence;
    sequence.pop();
    db.update("climbs", {ID: id}, function (climb) {
        climb.sequence = sequence;
        return climb;
    });
    db.commit();
    return Q.resolve(true);
}

function recordClimb(id, climbResult) {
    id = parseInt(id, 10);
    var sequence = db.query("climbs", {ID: id})[0].sequence;
    sequence.push(climbResult);
    db.update("climbs", {ID: id}, function (climb) {
        climb.sequence = sequence;
        return climb;
    });
    db.commit();
    return Q.resolve(true);
}

module.exports = {
    getLocation: getLocation,
    getGradeSystems: getGradeSystems,
    getClimbedDays: getClimbedDays,
    createNewLocation: createNewLocation,
    getEmojis: getEmojis,
    getLocationNameByDate: getLocationNameByDate,
    recordClimb: recordClimb,
    deleteRecord: deleteRecord,

    getDay: getDay,
    checkIn: checkIn,
    checkOut: checkOut,
    getRecentLocations: getRecentLocations,
    getClimbsByDate: getClimbsByDate
};
