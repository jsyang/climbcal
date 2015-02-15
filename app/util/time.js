var monthString = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getCurrentTimeString() {
    var now = new Date();
    var hourValue = now.getHours();

    var suffix = hourValue < 12? 'AM' : 'PM';
    var hour = hourValue < 12? hourValue : hourValue - 12;
    if(hour === 0) {
        hour = 12;
    }

    var minute = now.getMinutes();
    if(minute < 10) {
        minute = '0' + minute;
    }

    return hour + ':' + minute + ' ' + suffix;
}

function isToday(year, month, day) {
    var now = new Date();
    return now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day;
}

function isPast(year, month, day) {
    var givenDate = new Date();
    givenDate.setFullYear(year);
    givenDate.setMonth(month);
    givenDate.setDate(day);

    givenDate = +givenDate;

    var now = +new Date();

    return givenDate < now;
}

function isFuture(year, month, day) {
    var givenDate = new Date();
    givenDate.setFullYear(year);
    givenDate.setMonth(month);
    givenDate.setDate(day);

    givenDate = +givenDate;

    var now = +new Date();

    return givenDate > now;
}

function getElapsedTimeString(then, later) {
    var diff = later - then;
    var hours = Math.floor(diff / 3600000);
    var minutes = Math.floor((diff - hours * 3600000) / 60000);

    var hourName = hours > 1? 'hours' : 'hour';
    var minuteName = minutes > 1? 'minutes' : 'minute';

    var timeString = '';

    if(hours) {
        timeString += hours + ' ' + hourName;

        if(minutes) {
            timeString += ' and ';
        }
    }

    if(minutes) {
        timeString += minutes + ' ' + minuteName;
    }

    return timeString;
}

module.exports = {
    isPast : isPast,
    isFuture : isFuture,
    isToday : isToday,
    monthString : monthString,
    getCurrentTimeString : getCurrentTimeString,
    getElapsedTimeString : getElapsedTimeString
};
