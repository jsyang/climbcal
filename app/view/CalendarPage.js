var convertHTML = require('../util/vdom');
var template = require('./CalendarPage.dot');
var monthWeeks = require('./widget/Month.js');
var monthTemplate = require('./widget/Month.dot');
var className = 'CalendarPage';

function getPrevRoute(date) {
    var month = date.getMonth();
    var year = date.getFullYear();
    if(month === 0) {
        year--;
        month = 11;
    } else {
        month--;
    }
    return '/y/' + year + '/m/' + month;
}

function getNextRoute(date) {
    var month = date.getMonth();
    var year = date.getFullYear();
    if(month === 11) {
        year++;
        month = 0;
    } else {
        month++;
    }
    return '/y/' + year + '/m/' + month;
}

function render(state) {
    var weeks = monthWeeks(state.date);
    state.monthHTML = monthTemplate(weeks);

    state.prevRoute = getPrevRoute(state.date);
    state.nextRoute = getNextRoute(state.date);

    var html = template(state);
    return convertHTML(html);
}

function onPrev(titleEl){
    this.emit('prev');
    titleEl.textContent = getMonthName() + ' ' + getYear();
    addTodayHighlight();
}

function onNext(titleEl){
    this.emit('next');
    titleEl.textContent = getMonthName() + ' ' + getYear();
    addTodayHighlight();
}

function addDaysWithClimbs(state){
    var path = window.location.pathname + '/d/';
    state.days.forEach(function(day){
        document.querySelector('a[href="'+ path + day.day +'"]').classList.add('climbed');
    });
}

function onLogoClick(){
    this.el.classList.toggle('show-left-menu');
}

function onGradeSystemChange(e) {
    localStorage.setItem('preferredSystemName', e.target.selectedOptions[0].value);
}

function initEl() {
    var that = this;

    this.el = document.querySelector('.' + className);

    var _onLogoClick = onLogoClick.bind(this);
    this.logoButton = this.el.querySelector('.logo');
    this.logoButton.addEventListener('click', _onLogoClick);
    this.menu = this.el.querySelector('.left-menu');
    this.menu.querySelector('.background').addEventListener('click', _onLogoClick);
    this.el.querySelector('.set-grade-system select').addEventListener('change', onGradeSystemChange);
}

module.exports = {
    className: className,
    render   : render,

    init: function (state) {
        initEl.call(this);
        addDaysWithClimbs(state);
    },

    update: function(state) {
        addDaysWithClimbs(state);
    }
};
