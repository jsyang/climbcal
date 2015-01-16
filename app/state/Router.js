var page = require('page');

var DOM = require('./Renderer');
var CalendarPage = require('../view/CalendarPage');

var pageMap = {
  'CalendarPage' : CalendarPage
};

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
    page();
  },

  onCalendar: function (ctx) {
    var todayDate = (new Date()).toDateString().split(' ');
    createPage(CalendarPage, {
      monthYear : todayDate[1] + ' ' + todayDate[3]
    });
  }
};
