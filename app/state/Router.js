var $ = require('jquery');
var page = require('page');

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

  if (pageEl && pageEl.classList.contains(page.className.substr(1))) {
    if(page.update) {
      page.update(state);
    }

    return false;

  } else {

    destroyPage(pageEl);

    while (document.body.lastElementChild) {
      document.body.removeChild(document.body.lastElementChild);
    }

    document.body.appendChild(page.render(state).get(0));
    page.init(state);

    return true;
  }
}

module.exports = {
  page: page,

  createPage: createPage,

  _getBoundHandler: function (name) {
    return this[name] ? this[name].bind(this) : undefined;
  },

  init: function () {
    //this.page('/', '/calendar');
    this.page('/', this._getBoundHandler('onCalendar'));

    this.page();
  },

  onCalendar: function (ctx) {
    this.createPage(CalendarPage);
  }
};
