var convertHTML = require('../util/vdom');
var template = require('./CheckOutPage.dot');

var className = 'CheckOutPage';
var emojiPicker = require('./widget/EmojiPicker');

function render(state) {
    var html = template(state);
    return convertHTML(html);
}

function updateCheckOutLink() {
    var href = this.checkOutLink.href.split('?');
    this.checkOutLink.href = href[0] + '?' + [
        'locationName=' + this.values.locationName,
        'time=' + this.values.time,
        'emojiId=' + this.values.emojiId,
        'note=' + this.values.note
    ].join('&');
}

function updateEmojiId(id, url) {
    this.emojiId.style.backgroundImage = 'url(' + url + ')';
    this.emojiId.setAttribute('data-value', id);
    this.values.emojiId = id;
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
            cb : updateEmojiId.bind(that)
        });
    });
}

function updateNoteValue() {
    var value = this.noteValue.value;
    this.values.note = value;

    updateCheckOutLink.call(this);
}

function initEl() {
    this.el = document.querySelector('.' + className);

    this.checkOutLink = this.el.querySelector('.check-out');
    this.emojiId = this.el.querySelector('.feeling-note .label');
    this.noteValue = this.el.querySelector('.feeling-note input');

    updateNoteValue.call(this);
}

function bindEvents() {
    this.emojiId.addEventListener('mousedown', openEmojiPicker.bind(this));

    this.noteValue.addEventListener('blur', updateNoteValue.bind(this));
    var that = this;
    this.noteValue.addEventListener('keypress', function (e) {
        if (e.which === 13) {
            e.target.blur();
            that.checkInLink.click();
        }
    });
}

module.exports = {
    className: className,
    render   : render,

    init: function (state) {
        this.dateString = state.dateString;

        this.values = {
            locationName: state.locationName,
            time: +new Date(),
            emojiId: undefined,
            note: undefined
        };

        initEl.call(this);
        bindEvents.call(this);
    },

    update: function() {
        initEl.call(this);
        bindEvents.call(this);
    }
};
