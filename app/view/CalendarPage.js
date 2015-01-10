var $ = require('jquery');

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


  }
};
