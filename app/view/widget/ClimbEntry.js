var template = require('./ClimbEntry.hbs');

function render(state) {
    return template(state);
}

module.exports = {
    render : render,
    init: function() {}
};
