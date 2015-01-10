var $ = require('jquery');
var Calendar = require('calendar');

var className = '.CalendarPage';

function render(state) {
  var selector = className;

  var $el = $('<div/>').addClass(className.substr(1));

  return $el;
}

module.exports = {
  className: className,
  render   : render,

  init: function (state) {
    this.$el = $(className);
    this.cal = new Calendar();
    this.$el.append(this.cal.el);
  }
};
