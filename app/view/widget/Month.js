// Adapted from https://github.com/Raynos/calendar

function clamp(month) {
    if (month > 11) return 0;
    if (month < 0) return 11;
    return month;
}

function isLeapYear(year){
    return (0 === year % 400) ||
    ((0 === year % 4) && (0 !== year % 100)) ||
    (0 === year);
}

function daysInMonth(month, year) {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

function cellsBefore(n, month, year) {
    var cells = [];
    if (month === 0) --year;
    var prev = clamp(month - 1);
    var before = daysInMonth(prev, year);
    while (n--) cells.push({
        year: year,
        month: month,
        day: before--,
        className: 'prev'
    });
    return cells.reverse();
}

function cellsAfter(n, month, year) {
    var cells = [];
    var day = 0;
    if (month === 11) ++year;
    var prev = clamp(month + 1);
    while (n--) cells.push({
        year: year,
        month: month,
        day: ++day,
        className: 'next'
    });
    return cells;
}

module.exports = function(date) {
    var today = new Date();
    var todayDay = today.getDate();
    var todayMonth = today.getMonth();
    var todayYear = today.getFullYear();

    var month = date.getMonth();
    var year = date.getFullYear();

    // Calculate overflow
    var start = new Date(date);
    start.setDate(1);
    var before = start.getDay();
    var total = daysInMonth(month, year);
    var totalShown = 7 * Math.ceil((total + before) / 7);
    var after = totalShown - (total + before);
    var cells = [];

    // Cells before
    cells = cells.concat(cellsBefore(before, month, year));

    // Cells in current month
    for (var i = 0; i < total; ++i) {
        var dayObj = {
            year : year,
            month : month,
            day : i + 1,
            className : ''
        };

        if(year === todayYear && month === todayMonth && dayObj.day === todayDay) {
            dayObj.className = 'today';
        }

        cells.push(dayObj);
    }

    // Cells after
    cells = cells.concat(cellsAfter(after, month, year));

    var weeks = [];
    for(i = 0; i * 7 < cells.length; i++) {
        weeks.push(cells.slice(i*7, (i+1)*7));
    }

    return weeks;
};
