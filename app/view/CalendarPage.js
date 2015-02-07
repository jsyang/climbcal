var Calendar = require('calendar');

var convertHTML = require('../util/vdom').convertHTML;
var template = require('./CalendarPage.hbs');

var className = 'CalendarPage';

function render(state) {
    var html = template(state);
    return convertHTML(html);
}

function addTodayHighlight() {
    var today = new Date();
    var dateString = [
    today.getUTCFullYear(),
    today.getMonth(),
    today.getDate()
    ].join('-');

    var todayEl = document.querySelector("a[data-date='"+ dateString+"']");
    if(todayEl) {
        todayEl.classList.add('today');
    }
}

function getMonthName() {
    return document.querySelector('.title .month').textContent.substr(0,3);
}

function getYear() {
    return document.querySelector('.title .year').textContent;
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

function addDaysWithClimbs(){

}

function onLogoClick(){
    this.el.classList.toggle('show-left-menu');
}

function onGradeSystemChange(e) {
    localStorage.setItem('preferredSystemName', e.target.selectedOptions[0].value);
}

module.exports = {
    className: className,
    render   : render,

    init: function (state) {
        this.el = document.querySelector('.' + className);

        var _onLogoClick = onLogoClick.bind(this);
        this.logoButton = this.el.querySelector('.logo');
        this.logoButton.addEventListener('click', _onLogoClick);
        this.menu = this.el.querySelector('.left-menu');
        this.menu.querySelector('.background').addEventListener('click', _onLogoClick);


        this.cal = new Calendar();
        this.el.querySelector('.content').appendChild(this.cal.el);
        addTodayHighlight();

        var titleEl = this.el.querySelector('.title');

        this.el.querySelector('.prev').addEventListener('click', onPrev.bind(this.cal.days, titleEl));
        this.el.querySelector('.next').addEventListener('click', onNext.bind(this.cal.days, titleEl));

        this.el.querySelector('.set-grade-system select').addEventListener('change', onGradeSystemChange);
    },

    update: function(state) {
        addTodayHighlight();
        addDaysWithClimbs();
    }
};
