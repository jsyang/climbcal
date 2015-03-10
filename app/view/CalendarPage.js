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
    this.el.classList.add('show-left-menu');
}

function onMenuBackgroundClick(){
    this.el.classList.remove('show-left-menu');
}

function onGradeSystemChange(e) {
    localStorage.setItem('preferredSystemName', e.target.selectedOptions[0].value);
}

function initEl() {
    this.el = document.querySelector('.' + className);
    this.menu = this.el.querySelector('.left-menu');
    this.logoButton = this.el.querySelector('.logo');
    this.gradeSystemSelect = this.el.querySelector('.set-grade-system select');
    this.menuBackground = this.menu.querySelector('.background');
}

function bindEvents() { 
    this.logoButton.addEventListener('click', onLogoClick.bind(this));
    this.menuBackground.addEventListener('click', onMenuBackgroundClick.bind(this));
    this.gradeSystemSelect.addEventListener('change', onGradeSystemChange);
}

module.exports = {
    className: className,
    render   : render,

    init: function (state) {
        initEl.call(this);
        bindEvents.call(this);
        this.update(state);
    },

    update: function(state) {
        addDaysWithClimbs(state);
        this.el.classList.remove('show-left-menu');
    }
};
