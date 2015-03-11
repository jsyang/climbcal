var convertHTML = require('../util/vdom');
var template = require('./DayPage.dot');
var page = require('page');
var ClimbEntryTemplate = require('./widget/ClimbEntry.dot');
var DbHelper = require('../util/DbHelper');

var className = 'DayPage';

function climbEntries(entries, collapseEmpty) {
    var html = "";

    entries
    .sort(function(a, b){
        return b.value - a.value;
    })
    .filter(function(entry){
        if(collapseEmpty) {
            return entry.sequence.length;
        } else {
            return true;
        }
    })
    .forEach(function(entry){
        var seqString = entry.sequence.join('');
        if(seqString) {
            var wins = seqString.match(/1/g);
            wins = wins? wins.length : 0;
            entry.percent = wins / seqString.length * 100;
            entry.wins = wins;
            entry.losses = seqString.length - wins;
        } else {
            entry.wins = '';
            entry.losses = '';
            entry.percent = 100;
            entry.nodata = true;
        }

        html += ClimbEntryTemplate(entry);
    });

    return html;
}

function render(state) {
    state.climbsHTML = climbEntries(state.climbs, state.status === 'checked-out');
    var html = template(state);
    return convertHTML(html);
}

function refresh() {
    page(window.location.pathname);
}

function onClimbClick(e) {
    var el = e.currentTarget;
    var name = e.target.className;
    var id = parseInt(el.id, 10);

    if (name === 'name') {
        // Delete last record
        DbHelper.deleteRecord(id)
            .then(refresh);
    } else if (name === 'left') {
        // Record a win
        DbHelper.recordClimb(id, 1)
            .then(refresh);
    } else if (name === 'right') {
        // Record a loss
        DbHelper.recordClimb(id, 0)
            .then(refresh);
    }
}

function onMoreClick(){
    this.el.classList.toggle('show-right-menu');
}

module.exports = {
    className: className,
    render   : render,

    init: function (state) {
        this.el = document.querySelector('.' + className);

        this.onMoreClick = onMoreClick.bind(this);
        this.menu = this.el.querySelector('.right-menu');
        if(this.menu) {
            this.menu.querySelector('.background').addEventListener('click', this.onMoreClick);
        }

        this.helpButton = this.el.querySelector('.help');
        if(this.helpButton) {
            this.helpButton.addEventListener('click', this.onMoreClick);
        }

        if (state.status === 'checked-in') {
            this.onClimbClick = onClimbClick.bind(this);
            this.update(state);
        }

    },

    update: function (state) {
        var that = this;

        if(state.today) {
            // Attach event listeners to any new climb entries.
            Array.prototype.slice.call(this.el.querySelectorAll('.ClimbEntry'))
            .forEach(function (el) {
                if (!el.onclick) {
                    el.onclick = that.onClimbClick;
                }
            });
        }

        this.state = state;
    }
};
