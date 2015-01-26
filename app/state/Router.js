var page = require('page');
var DOM = require('./Renderer');
var DbHelper = require('../util/DbHelper');

var CalendarPage = require('../view/CalendarPage');
var DayPage = require('../view/DayPage');
var CheckInPage = require('../view/CheckInPage');
var CheckOutPage = require('../view/CheckOutPage');
var LogPage = require('../view/LogPage');

var pageMap = {
  'CalendarPage' : CalendarPage,
  'CheckInPage' : CheckInPage,
  'CheckOutPage' : CheckOutPage,
  'LogPage' : LogPage
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

function queryStringToDict(q) {
  var strings = q.split('&');

  if(strings[0]) {
    var obj = {};

    strings.forEach(function(v){
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
  if(pageClass && pageClass.destroy) {
    pageClass.destroy();
  }
}

function createPage(page, state) {
  var pageEl = document.body.lastElementChild;

  if (pageEl && pageEl.classList.contains(page.className)) {
    DOM.update(page.render(state));

    if(page.update) {
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
    page('/', this._getBoundHandler('onCalendar'));
    page('/y/:year/m/:month/d/:day', this._getBoundHandler('onShowDay'));
    page('/y/:year/m/:month/d/:day/in', this._getBoundHandler('onCheckIn'));
    page('/y/:year/m/:month/d/:day/out', this._getBoundHandler('onCheckOut'));
    page('/y/:year/m/:month/d/:day/log', this._getBoundHandler('onLog'));
    page('/y/:year/m/:month/d/:day/plan', this._getBoundHandler('onPlan'));
    page();
  },

  onCheckIn: function(ctx) {
    var year = ctx.params.year;
    var month = ctx.params.month;
    var day = ctx.params.day;

    var monthName = monthString[month];

    if(ctx.querystring) {
      var args = queryStringToDict(ctx.querystring);
      DbHelper
        .checkIn(year, month, day, args.location, args.time, args.feeling, args.note)
        .then(function(){
          var dayRoute = ctx.canonicalPath.split('?')[0].replace('/in', '');
          page.redirect(dayRoute);
        });

    } else {
      DbHelper.getRecentLocations()
        .then(function(locations){
          locations.reverse();

          createPage(CheckInPage, {
            locations : locations,
            dayRoute : ctx.canonicalPath.replace('/in', ''),
            dateString : monthName + ' ' + day + ', ' + year
          });
        });
    }
  },

  onCheckOut: function(ctx) {
    var year = ctx.params.year;
    var month = ctx.params.month;
    var day = ctx.params.day;

    var monthName = monthString[month];

    if(ctx.querystring) {
      var args = queryStringToDict(ctx.querystring);
      DbHelper
        .checkOut(year, month, day, args.time, args.feeling, args.note)
        .then(function(){
          var dayRoute = ctx.canonicalPath.split('?')[0].replace('/out', '');
          page.redirect(dayRoute);
        });

    } else {
      DbHelper.getRecentLocations()
        .then(function(locations){
          locations.reverse();

          createPage(CheckOutPage, {
            lastLocation : locations[0],
            dayRoute : ctx.canonicalPath.replace('/out', ''),
            dateString : monthName + ' ' + day + ', ' + year
          });
        });
    }
  },

  onLog: function(ctx) {
    var year = ctx.params.year;
    var month = ctx.params.month;
    var day = ctx.params.day;
  },

  onPlan: function(ctx) {
    var year = ctx.params.year;
    var month = ctx.params.month;
    var day = ctx.params.day;
  },

  onShowDay: function(ctx) {
    var year = parseInt(ctx.params.year, 10);
    var month = parseInt(ctx.params.month, 10);
    var day = parseInt(ctx.params.day, 10);

    var today = isToday(year, month, day)? 'today' : '';

    var monthName = monthString[month];
    var dayObj;
    var dayStatus = '';
    var dayClimbs;

    DbHelper.getDay(year, month, day)
      .then(function(dayEntry){
        dayObj = dayEntry || {};
        if(dayObj.id) {
          if(dayObj.checkInTime && !dayObj.checkOutTime) {
            dayStatus = 'checked-in';
          } else if(dayObj.checkInTime && dayObj.checkOutTime) {
            dayStatus = 'checked-out';
          }

          return DbHelper.getClimbsByDayId(dayObj.id);
        } else {
          return [];
        }
      })
      .then(function(climbs){
        createPage(DayPage, {
          day : dayObj,
          climbs : climbs,
          status : dayStatus,
          today : today,
          dateString : monthName + ' ' + day + ', ' + year,
          route : ctx.canonicalPath
        });
      });
  },

  onCalendar: function (ctx) {
    var todayDate = (new Date()).toDateString().split(' ');

    createPage(CalendarPage, {
      monthYear : todayDate[1] + ' ' + todayDate[3]
    });
  }
};
