var page = require('page');
var convertHTML = require('../util/vdom');
var template = require('./CheckInPage.dot');
var insertLoaderOverlay = require('./widget/LoaderOverlay');
var alertError = require('../util/alertError');
var DbHelper = require('../util/DbHelper');


var className = 'CheckInPage';
var emojiPicker = require('./widget/EmojiPicker');

function render(state) {
    var html = template(state);
    return convertHTML(html);
}

function updateCheckInLink() {
    var href = this.checkInLink.href.split('?');
    this.checkInLink.href = href[0] + '?' + [
        'locationName=' + escape(this.values.locationName),
        'time=' + this.values.time,
        'emojiId=' + this.values.emojiId,
        'note=' + this.values.note
    ].join('&');
}

function addNewGym(){
    var newGymName = prompt('Gym name');
    insertLoaderOverlay('.CheckInPage');

    if(newGymName) {
        return DbHelper.createNewLocation({
            lastUsed : +new Date(),
            name : newGymName
        })
        .then(refreshPage)
        .fail(alertError);
    } else {
        refreshPage();
    }
}

function refreshPage() {
    page(window.location.pathname);
}

function updateLocationValue() {
    var selected = this.locationSelect.selectedOptions[0];

    if(selected.value === 'add-new-gym') {
        this.locationSelect.selectedIndex = 0;
        addNewGym();

    } else {
        this.locationValue.textContent = selected.textContent;
        this.values.locationName = selected.textContent;

        updateCheckInLink.call(this);
    }
}

function openEmojiPicker() {
    var that = this;
    var el = document.createElement('div');
    el.classList.add(emojiPicker.className);
    emojiPicker.renderAsync()
        .then(function (html) {
            el.innerHTML = html;
            that.el.appendChild(el);
            emojiPicker.init({
                cb: updateEmojiId.bind(that)
            });
        });
}

function updateEmojiId(id, url) {
    this.emojiId.style.backgroundImage = 'url(' + url + ')';
    this.emojiId.setAttribute('data-value', id);
    this.values.emojiId = id;
    updateCheckInLink.call(this);
}

function updateNoteValue() {
    var value = this.noteValue.value;
    this.values.note = value;

    updateCheckInLink.call(this);
}

function initEl() {
    this.el = document.querySelector('.' + className);

    this.checkInLink = this.el.querySelector('.check-in');
    this.locationValue = this.el.querySelector('.location .value');
    this.locationSelect = this.el.querySelector('.location select');
    this.emojiId = this.el.querySelector('.feeling-note .label');
    this.noteValue = this.el.querySelector('.feeling-note input');

    updateLocationValue.call(this);
    updateNoteValue.call(this);
}

function bindEvents() {
    var that = this;
    this.locationSelect.addEventListener('change', updateLocationValue.bind(this));
    this.emojiId.addEventListener('mousedown', openEmojiPicker.bind(this));

    this.noteValue.addEventListener('blur', updateNoteValue.bind(this));
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
            locationName: undefined,
            time    : +new Date(),
            emojiId : -1,
            note    : undefined
        };

        initEl.call(this);
        bindEvents.call(this);
    },

    update: function() {
        initEl.call(this);
        bindEvents.call(this);
    }
};
