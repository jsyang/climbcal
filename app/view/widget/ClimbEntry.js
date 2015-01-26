var template = require('./ClimbEntry.hbs');

var className = 'ClimbEntry';

function render(state) {
    return template(state);
}

module.exports = {
    className : className,
    render : render,

    init: function(state) {
    }
};
