var convertHTML = require('../util/vdom').convertHTML;
var template = require('./CheckInPage.hbs');

var className = 'CheckInPage';
var getTime = require('../util/time');

var emojiPicker = require('./widget/EmojiPicker');

function render(state) {
  var html = template(state);
  return convertHTML(html);
}

function updateCheckInLink() {
  var href = this.checkInLink.href.split('?');
  this.checkInLink.href = href[0] + '?' + [
    'location=' + this.values.location,
    'time=' + this.values.time,
    'feeling=' + this.values.feeling,
    'note=' + this.values.note
  ].join('&');
}

function updateLocationValue() {
  var selected = this.locationSelect.selectedOptions[0];

  this.locationValue.textContent = selected.textContent;
  this.values.location = selected.value;

  updateCheckInLink.call(this);
}

function updateTimeValue() {
  var time = getTime();
  this.timeValue.textContent = time;

  this.values.time = +new Date(time + ' ' + this.dateString);

  updateCheckInLink.call(this);
}

function openEmojiPicker() {
  var that = this;
  var el = document.createElement('div');
  el.classList.add(emojiPicker.className);
  emojiPicker.renderAsync()
    .then(function(html) {
      el.innerHTML = html;
      that.el.appendChild(el);
      emojiPicker.init({
        cb : updateFeelingValue.bind(that)
      });
    });
}

function updateFeelingValue(id, url) {
  this.feelingValue.style.backgroundImage = 'url(' + url + ')';
  this.values.feeling = id;
  updateCheckInLink.call(this);
}

function updateNoteValue() {
  var value = this.noteValue.value;
  this.values.note = value;

  updateCheckInLink.call(this);
}

module.exports = {
  className: className,
  render   : render,

  init: function (state) {
    this.dateString = state.dateString;

    this.values = {
      location: undefined,
      time: +new Date(),
      feeling: undefined,
      note: undefined
    };

    this.el = document.querySelector('.' + className);

    this.checkInLink = this.el.querySelector('.check-in');

    this.locationValue = this.el.querySelector('.location .value');
    this.locationSelect = this.el.querySelector('.location select');

    this.feelingValue = this.el.querySelector('.feeling .value');

    this.noteValue = this.el.querySelector('.note .value');

    // Update values

    this.locationSelect.addEventListener('change', updateLocationValue.bind(this));
    updateLocationValue.call(this);

    this.feelingValue.addEventListener('mousedown', openEmojiPicker.bind(this));
    // todo: use most recently used feeling
    //updateFeelingValue.call(this, );

    this.noteValue.addEventListener('blur', updateNoteValue.bind(this));
    updateNoteValue.call(this);
  }
};
