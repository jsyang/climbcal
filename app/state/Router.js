var page = require('page');
var Q = require('kew');

var DOM = require('./Renderer');
var DbHelper = require('../util/DbHelper');
var db = require('../state/Database');
var exportCSV = require('../util/exportCSV');

var alertError = require('../util/alertError');
var monthString = require('../util/time').monthString;
var getCurrentTimeString = require('../util/time').getCurrentTimeString;
var getElapsedTimeString = require('../util/time').getElapsedTimeString;
var isToday = require('../util/time').isToday;
var isPast = require('../util/time').isPast;
var isFuture = require('../util/time').isFuture;

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
    init: function () {
        var that = this;
        var getHandler = function (name) {
            return that[name] ? that[name].bind(that) : undefined;
        };

        page('/', getHandler('onToday'));
        page('/today', getHandler('onToday'));
        page('/exportcsv', getHandler('onExportCSV'));
        page('/deletedb', getHandler('onDeleteDatabase'));
        page('/y/:year/m/:month', getHandler('onShowMonth'));
        page('/y/:year/m/:month/d/:day', getHandler('onShowDay'));
        page('/y/:year/m/:month/d/:day/in', getHandler('onCheckIn'));
        page('/y/:year/m/:month/d/:day/out', getHandler('onCheckOut'));
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
                .checkIn(year, month, day, args.locationName, args.time, args.emojiId, args.note)
                .then(function () {
                    var dayRoute = ctx.canonicalPath.split('?')[0].replace('/in', '');
                    page.redirect(dayRoute);
                })
                .fail(alertError);

        } else {
            DbHelper.getRecentLocations()
                .then(function (locations) {
                    createPage(CheckInPage, {
                        timeString : getCurrentTimeString(),
                        locations  : locations,
                        dayRoute   : ctx.canonicalPath.replace('/in', ''),
                        dateString : monthName + ' ' + day + ', ' + year
                    });
                })
                .fail(alertError);
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
                .checkOut(year, month, day, args.time, args.emojiId, args.note)
                .then(function () {
                    var dayRoute = ctx.canonicalPath.split('?')[0].replace('/out', '');
                    page.redirect(dayRoute);
                })
                .fail(alertError);

        } else {
            DbHelper.getRecentLocations()
                .then(function (locations) {
                    createPage(CheckOutPage, {
                        timeString  : getCurrentTimeString(),
                        lastLocation: locations[0],
                        dayRoute    : ctx.canonicalPath.replace('/out', ''),
                        dateString  : monthName + ' ' + day + ', ' + year
                    });
                })
                .fail(alertError);
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

        var elapsedTimeString = '';

        Q.all([
            DbHelper.getDay(year, month, day),
            DbHelper.getClimbsByDate(year, month, day),
            DbHelper.getLocationNameByDate(year, month, day)
        ])
            .then(function(results){
                var dayObj = results[0];
                var climbs = results[1];
                var locationName = results[2];
                if(dayObj){
                    if (dayObj.checkInTime && !dayObj.checkOutTime) {
                        dayStatus = 'checked-in';
                    } else if (dayObj.checkInTime && dayObj.checkOutTime) {
                        dayStatus = 'checked-out';
                        elapsedTimeString = getElapsedTimeString(dayObj.checkInTime, dayObj.checkOutTime);
                    }
                }

                createPage(DayPage, {
                    isPast    : isPastDate,
                    isFuture  : isFutureDate,
                    day       : dayObj,
                    locName   : locationName,
                    elapsedTimeString : elapsedTimeString,
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
            days : [],
            date : theDate,
            monthYear: monthYear,
            preferredSystemName : localStorage.getItem('preferredSystemName'),
            quickstartRoute : '/y/' + today.getFullYear() + '/m/' + today.getMonth() + '/d/' + today.getDate()
        };

        Q.all([
            DbHelper.getGradeSystems(),
            DbHelper.getClimbedDays(month, year)
        ])
            .then(function(result){
                state.gradesystems = result[0];
                state.days = result[1];
                createPage(CalendarPage, state);
            })
            .fail(alertError);
    },

    onExportCSV: function() {
        exportCSV();
        page.redirect('/');
    },

    onDeleteDatabase: function () {
        if(confirm('Deleted data cannot be recovered!\nAre you sure you want to do this?')){
            insertLoaderOverlay('body');
            db.drop();
            window.location.href = '/';
        } else {
            page.redirect('/');
        }
    }
};
