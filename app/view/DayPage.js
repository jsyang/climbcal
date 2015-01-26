var convertHTML = require('../util/vdom').convertHTML;
var template = require('./DayPage.hbs');
var page = require('page');

var db = require('../state/Database');

var className = 'DayPage';

function render(state) {
  var html = template(state);
  return convertHTML(html);
}

module.exports = {
  className: className,
  render   : render,

  init: function (state) {
    this.el = document.querySelector('.' + className);

    this.el.querySelector('.log-climbs')
      .addEventListener('click', function(e){
        var gradeNumber = Math.floor(Math.random() * 7) + 3;

        db.grades.where('name')
          .equalsIgnoreCase('v'+gradeNumber)
          .first(function(gradeEntry){
            var sequence = [];
            while(sequence.length < 8) {
              sequence.push(Math.round(Math.random()));
            }

            return db.climbs.put({
              dayId : state.day.id,
              gradeId : gradeEntry.id,
              name : gradeEntry.name,
              sequence : sequence,
              value : gradeEntry.value
            });

          })
          .then(function(){
            page(state.route);
          });
      });
  }
};
