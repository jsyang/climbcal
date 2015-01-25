var convertHTML = require('../util/vdom').convertHTML;
var template = require('./CheckOutPage.hbs');

var className = 'CheckOutPage';
var getTime = require('../util/time');

var emojiPicker = require('./widget/EmojiPicker');

function render(state) {
    var html = template(state);
    return convertHTML(html);
}

function updateCheckOutLink() {
    var href = this.checkOutLink.href.split('?');
    this.checkOutLink.href = href[0] + '?' + [
            'location=' + this.values.location,
            'time=' + this.values.time,
            'feeling=' + this.values.feeling,
            'note=' + this.values.note
    ].join('&');
}


function updateFeelingValue(id, url) {
  this.feelingValue.style.backgroundImage = 'url(' + url + ')';
  this.values.feeling = id;
  updateCheckOutLink.call(this);
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

function updateNoteValue() {
    var value = this.noteValue.value;
    this.values.note = value;

    updateCheckOutLink.call(this);
}

module.exports = {
    className: className,
    render   : render,

    init: function (state) {
        this.dateString = state.dateString;

        this.values = {
            location: state.locationValue,
            time: +new Date(),
            feeling: undefined,
            note: undefined
        };

        this.el = document.querySelector('.' + className);

        this.checkOutLink = this.el.querySelector('.check-out');

        this.feelingValue = this.el.querySelector('.feeling .value');

        this.noteValue = this.el.querySelector('.note .value');

        // Update values

        this.feelingValue.addEventListener('mousedown', openEmojiPicker.bind(this));
        // todo: use most recently used feeling
        //updateFeelingValue.call(this, );

        this.noteValue.addEventListener('blur', updateNoteValue.bind(this));
        updateNoteValue.call(this);
    }
};
