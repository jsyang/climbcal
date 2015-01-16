var $ = require('jquery');
var Calendar = require('calendar');

var convertHTML = require('../util/vdom').convertHTML;
var template = require('./CalendarPage.hbs');

var className = 'CalendarPage';

function render(state) {
  var html = template(state);
  return convertHTML(html);
}

function addTodayHighlight() {
  var today = new Date();
  var dateString = [
    today.getUTCFullYear(),
    today.getMonth(),
    today.getDate()
  ].join('-');

  document.querySelector("a[data-date='"+ dateString+"']")
    .classList.add('today');
}

module.exports = {
  className: className,
  render   : render,

  init: function (state) {
    this.el = document.querySelector('.' + className);
    this.cal = new Calendar();
    this.el.appendChild(this.cal.el);

    addTodayHighlight();
  }
};
