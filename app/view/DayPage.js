var convertHTML = require('../util/vdom').convertHTML;
var template = require('./DayPage.dot');
var page = require('page');
var ClimbEntryTemplate = require('./widget/ClimbEntry.dot');

var db = require('../state/Database');

var className = 'DayPage';

function climbEntries(entries) {
    var html = "";

    entries
    .sort(function(a, b){
        return b.value - a.value;
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
    state.climbsHTML = climbEntries(state.climbs);
    var html = template(state);
    return convertHTML(html);
}

function refresh() {
    page(window.location.pathname);
}

function deleteRecord(id) {
    db.climbs.get(id)
        .then(function (climbEntry) {
            climbEntry.sequence.pop();
            return db.climbs.update(climbEntry.id, {
                sequence: climbEntry.sequence
            });
        })
        .then(refresh);
}

function recordClimb(id, climbResult) {
    db.climbs.get(id)
        .then(function (climbEntry) {
            var changes = {
                sequence: climbEntry.sequence.concat(climbResult)
            };

            return db.climbs.update(climbEntry.id, changes);
        })
        .then(refresh);
}

function onClimbClick(e) {
    var el = e.currentTarget;
    var name = e.target.className;
    var id = parseInt(el.id, 10);

    if (name === 'name') {
        // Delete last record
        deleteRecord(id);
    } else if (name === 'left') {
        // Record a win
        recordClimb(id, 1);
    } else if (name === 'right') {
        // Record a loss
        recordClimb(id, 0);
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
