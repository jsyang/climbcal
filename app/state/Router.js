var page = require('page');
var DOM = require('./Renderer');
var DbHelper = require('../util/DbHelper');
var db = require('../state/Database');

var alertError = require('../util/alertError');
var getTimeString = require('../util/time');

var CalendarPage = require('../view/CalendarPage');
var DayPage = require('../view/DayPage');
var CheckInPage = require('../view/CheckInPage');
var CheckOutPage = require('../view/CheckOutPage');

var insertLoaderOverlay = require('../view/widget/LoaderOverlay');

var pageMap = {
    'CalendarPage': CalendarPage,
    'CheckInPage' : CheckInPage,
    'CheckOutPage': CheckOutPage,
    'DayPage'     : DayPage
};

var monthString = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

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

function queryStringToDict(q) {
    var strings = q.split('&');

    if (strings[0]) {
        var obj = {};

        strings.forEach(function (v) {
            var query = v.split('=');
            var key = query[0];
            var value = query[1] || '';
            obj[key] = value;
        });

        return obj;

    } else {
        return undefined;
    }
}

function destroyPage(pageEl) {
    var pageClass = pageMap[pageEl && pageEl.classList[0]];
    if (pageClass && pageClass.destroy) {
        pageClass.destroy();
    }
}

function createPage(page, state) {
    var pageEl = document.body.lastElementChild;

    if (pageEl && pageEl.classList.contains(page.className)) {
        DOM.update(page.render(state));

        if (page.update) {
            page.update(state);
        }

        return false;

    } else {
        destroyPage(pageEl);

        DOM.initialize(page.render(state));
        page.init(state);

        return true;
    }
}

module.exports = {
    _getBoundHandler: function (name) {
        return this[name] ? this[name].bind(this) : undefined;
    },

    init: function () {
        page('/', this._getBoundHandler('onToday'));
        page('/today', this._getBoundHandler('onToday'));
        page('/deletedb', this._getBoundHandler('onDeleteDatabase'));
        page('/y/:year/m/:month', this._getBoundHandler('onShowMonth'));
        page('/y/:year/m/:month/d/:day', this._getBoundHandler('onShowDay'));
        page('/y/:year/m/:month/d/:day/in', this._getBoundHandler('onCheckIn'));
        page('/y/:year/m/:month/d/:day/out', this._getBoundHandler('onCheckOut'));
        page();
    },

    onCheckIn: function (ctx) {
        var year = ctx.params.year;
        var month = ctx.params.month;
        var day = ctx.params.day;

        var monthName = monthString[month];

        if (ctx.querystring) {
            var args = queryStringToDict(ctx.querystring);
            DbHelper
                .checkIn(year, month, day, args.location, args.time, args.feeling, args.note)
                .then(function () {
                    var dayRoute = ctx.canonicalPath.split('?')[0].replace('/in', '');
                    page.redirect(dayRoute);
                })
                .catch(alertError);

        } else {
            DbHelper.getRecentLocations()
                .then(function (locations) {
                    locations.reverse();

                    createPage(CheckInPage, {
                        timeString : getTimeString(),
                        locations  : locations,
                        dayRoute   : ctx.canonicalPath.replace('/in', ''),
                        dateString : monthName + ' ' + day + ', ' + year
                    });
                })
                .catch(alertError);
        }
    },

    onCheckOut: function (ctx) {
        var year = ctx.params.year;
        var month = ctx.params.month;
        var day = ctx.params.day;

        var monthName = monthString[month];

        if (ctx.querystring) {
            var args = queryStringToDict(ctx.querystring);
            DbHelper
                .checkOut(year, month, day, args.time, args.feeling, args.note)
                .then(function () {
                    var dayRoute = ctx.canonicalPath.split('?')[0].replace('/out', '');
                    page.redirect(dayRoute);
                })
                .fail(alertError);

        } else {
            DbHelper.getRecentLocations()
                .then(function (locations) {
                    locations.reverse();

                    createPage(CheckOutPage, {
                        timeString  : getTimeString(),
                        lastLocation: locations[0],
                        dayRoute    : ctx.canonicalPath.replace('/out', ''),
                        dateString  : monthName + ' ' + day + ', ' + year
                    });
                })
                .catch(alertError);
        }
    },

    onShowDay: function (ctx) {
        var year = parseInt(ctx.params.year, 10);
        var month = parseInt(ctx.params.month, 10);
        var day = parseInt(ctx.params.day, 10);

        var today = isToday(year, month, day) ? 'today' : '';

        var monthName = monthString[month];
        var dayObj;
        var dayStatus = '';
        var dayClimbs;

        var isPastDate = isPast(year, month, day);
        var isFutureDate = isFuture(year, month, day);

        DbHelper.getDay(year, month, day)
            .then(function (dayEntry) {
                dayObj = dayEntry || {};
                if (dayObj.id) {
                    if (dayObj.checkInTime && !dayObj.checkOutTime) {
                        dayStatus = 'checked-in';
                    } else if (dayObj.checkInTime && dayObj.checkOutTime) {
                        dayStatus = 'checked-out';
                    }

                    return DbHelper.getClimbsByDayId(dayObj.id);
                } else {
                    return [];
                }
            })
            .then(function (climbs) {
                createPage(DayPage, {
                    isPast    : isPastDate,
                    isFuture  : isFutureDate,
                    day       : dayObj,
                    climbs    : climbs,
                    status    : dayStatus,
                    today     : today,
                    dateString: monthName + ' ' + day + ', ' + year,
                    backRoute : '/y/' + year + '/m/' + month,
                    route     : ctx.canonicalPath
                });
            })
            .fail(alertError);
    },

    onToday: function(ctx) {
        var today = new Date();
        ctx.handled = true;
        page.redirect('/y/' + today.getFullYear() + '/m/' + today.getMonth());
    },

    onShowMonth: function (ctx) {
        var year = parseInt(ctx.params.year, 10);
        var month = parseInt(ctx.params.month, 10);

        var today = new Date();
        var theDate = new Date();
        theDate.setFullYear(year);
        theDate.setMonth(month);

        var monthYear = theDate.toDateString().split(' ');
        monthYear = monthYear[1] + ' ' + monthYear[3];

        var state = {
            date : theDate,
            monthYear: monthYear,
            preferredSystemName : localStorage.getItem('preferredSystemName'),
            quickstartRoute : '/y/' + today.getFullYear() + '/m/' + today.getMonth() + '/d/' + today.getDate()
        };

        db.gradesystems.toArray().then(function(gradesystems){
            state.gradesystems = gradesystems;
            createPage(CalendarPage, state);
        });
    },

    onDeleteDatabase: function () {
        if(confirm('Deleted data cannot be recovered!\nAre you sure you want to do this?')){
            insertLoaderOverlay('body');
            db.delete()
                .then(function () {
                    window.location.href = '/';
                })
                .catch(alertError);
        } else {
            page.redirect('/');
        }
    }
};
