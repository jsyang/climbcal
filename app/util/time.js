module.exports = function() {
  var now = new Date();
  var hourValue = now.getHours();

  var suffix = hourValue < 12? 'AM' : 'PM';
  var hour = hourValue < 12? hourValue : hourValue - 12;
  if(hour === 0) {
    hour = 12;
  }

  var minute = now.getMinutes();
  if(minute < 10) {
    minute = '0' + minute;
  }

  return hour + ':' + minute + ' ' + suffix;
};