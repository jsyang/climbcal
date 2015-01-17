module.exports = function() {
  var now = new Date();
  var suffix = now.getHours() < 12? 'AM' : 'PM';
  var hour = now.getHours() < 12? now.getHours() : now.getHours - 12;
  if(hour === 0) {
    hour = 12;
  }

  var minute = now.getMinutes();
  if(minute < 10) {
    minute = '0' + minute;
  }

  return hour + ':' + minute + ' ' + suffix;
};
