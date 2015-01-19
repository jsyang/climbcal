var page = require('page');

var DOM = require('./Renderer');
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
    var month = monthString[ctx.params.month];
    var day = ctx.params.day;

    if(ctx.querystring) {
      console.error(queryStringToDict(ctx.querystring));
    } else {
      createPage(CheckInPage, {
        dayRoute : ctx.canonicalPath.replace('/in', ''),
        dateString : month + ' ' + day + ', ' + year
      });
    }
  },

  onCheckOut: function(ctx) {
    var year = ctx.params.year;
    var month = monthString[ctx.params.month];
    var day = ctx.params.day;

    if(ctx.querystring) {
      console.error(queryStringToDict(ctx.querystring));
    } else {
      createPage(CheckOutPage, {
        dayRoute : ctx.canonicalPath.replace('/in', ''),
        dateString : month + ' ' + day + ', ' + year
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
    var year = ctx.params.year;
    var month = monthString[ctx.params.month];
    var day = ctx.params.day;

    createPage(DayPage, {
      dateString : month + ' ' + day + ', ' + year,
      route : ctx.canonicalPath
    });
  },

  onCalendar: function (ctx) {
    var todayDate = (new Date()).toDateString().split(' ');

    createPage(CalendarPage, {
      monthYear : todayDate[1] + ' ' + todayDate[3]
    });
  }
};
