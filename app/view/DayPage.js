var convertHTML = require('../util/vdom').convertHTML;
var template = require('./DayPage.hbs');
var page = require('page');

var db = require('../state/Database');

var className = 'DayPage';

function render(state) {
    var html = template(state);
    return convertHTML(html);
}

function refresh() {
    page(window.location.pathname);
}

function onAddNewGrade(e) {
    var dayId = this.state.day.id;
    var gradeId = parseInt(e.target.value, 10);
    var existingClimbs = this.state.climbs.map(function(obj){ return obj.gradeId; });
    e.target.value = 'cancel';

    if(existingClimbs.indexOf(gradeId) === -1) {
        db.grades.get(gradeId)
            .then(function (gradeEntry) {
                return db.climbs.put({
                    dayId   : dayId,
                    gradeId : gradeEntry.id,
                    name    : gradeEntry.name,
                    value   : gradeEntry.value,
                    sequence: []
                });
            })
            .then(refresh);
    }
}

function deleteRecord(id) {
    db.climbs.get(id)
        .then(function (climbEntry) {
            climbEntry.sequence.pop();
            var changes = {
                sequence: climbEntry.sequence
            };

            return db.climbs.update(climbEntry.id, changes);
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
        this.menu.querySelector('.background').addEventListener('click', this.onMoreClick);

        this.moreButton = this.el.querySelector('.more');
        if(this.moreButton) {
            this.moreButton.addEventListener('click', this.onMoreClick);
        }

        if (state.status === 'checked-in') {
            this.el.querySelector('.add-new-grade select')
                .addEventListener('change', onAddNewGrade.bind(this));

            this.onClimbClick = onClimbClick.bind(this);

            this.update(state);
        }

    },

    update: function (state) {
        var that = this;

        // Attach event listeners to any new climb entries.
        Array.prototype.slice.call(this.el.querySelectorAll('.ClimbEntry'))
            .forEach(function (el) {
                if (!el.onclick) {
                    el.onclick = that.onClimbClick;
                }
            });

        this.state = state;
    }
};
