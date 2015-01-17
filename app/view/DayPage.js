var convertHTML = require('../util/vdom').convertHTML;
var template = require('./DayPage.hbs');

var className = 'DayPage';

function render(state) {
  var html = template(state);
  return convertHTML(html);
}

module.exports = {
  className: className,
  render   : render,

  init: function (state) {
    this.el = document.querySelector('.' + className);
  }
};
