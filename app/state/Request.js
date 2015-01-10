var $ = require('jquery');

/**
 * Returns a jQuery promise for the request.
 * @param method
 * @param url
 * @param data
 * @returns {*}
 */
module.exports = function (method, url, data) {
    return $.ajax({
        dataType: "json",
        headers : app.session.getRequestHeaders(),
        method  : method,
        url     : app.SERVICE_ORIGIN + url,
        data    : data
    });
};