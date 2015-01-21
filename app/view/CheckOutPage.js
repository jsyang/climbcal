var convertHTML = require('../util/vdom').convertHTML;
var template = require('./CheckOutPage.hbs');

var className = 'CheckOutPage';
var getTime = require('../util/time');


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

function updateFeelingValue() {
    var id = this.feelingValue.getAttribute('data-id');
    this.values.feeling = id;

    updateCheckOutLink.call(this);
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

        this.time = this.el.querySelector('.time');
        this.timeValue = this.el.querySelector('.time .value');

        // Update values

        //this.feelingValue.addEventListener('mousedown', updateFeelingValue.bind(this));
        updateFeelingValue.call(this);

        this.noteValue.addEventListener('blur', updateNoteValue.bind(this));
        updateNoteValue.call(this);
    }
};
