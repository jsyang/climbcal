var convertHTML = require('../util/vdom').convertHTML;
var template = require('./CheckInPage.hbs');

var className = 'CheckInPage';
var getTime = require('../util/time');


function render(state) {
  var html = template(state);
  return convertHTML(html);
}

function updateLocationValue() {
  var selected = this.locationSelect.options[this.locationSelect.selectedIndex];
  this.locationValue.textContent = selected.textContent;
}

function updateTimeValue() {
  this.timeValue.textContent = getTime();
}

module.exports = {
  className: className,
  render   : render,

  init: function (state) {
    this.el = document.querySelector('.' + className);
    this.locationValue = this.el.querySelector('.location .value');
    this.locationSelect = this.el.querySelector('.location select');

    this.time = this.el.querySelector('.time');
    this.timeValue = this.el.querySelector('.time .value');

    this.locationSelect.addEventListener('change', updateLocationValue.bind(this));
    updateLocationValue.call(this);

    this.time.addEventListener('touchstart', updateTimeValue.bind(this));
    this.time.addEventListener('mousedown', updateTimeValue.bind(this));
  }
};
