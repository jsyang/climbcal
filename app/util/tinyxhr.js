var Q = require('kew');

module.exports = function(url, method, post, contenttype) {
    var deferred = Q.defer();

    var TIMEOUT = 10000;
    var xhr = new XMLHttpRequest();
    var requestTimeout = setTimeout(function () {
        xhr.abort();
        deferred.reject(new Error("tinyxhr: aborted by a timeout"), "", xhr);
    }, TIMEOUT);

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        clearTimeout(requestTimeout);

        if(xhr.status != 200) {
            deferred.reject(new Error("tinyxhr: server response status is " + xhr.status), xhr);
        } else {
            deferred.resolve(xhr.responseText, xhr);
        }
    };

    xhr.open(method ? method.toUpperCase() : "GET", url, true);

    if (!post) {
        xhr.send();
    } else {
        xhr.setRequestHeader('Content-type', contenttype ? contenttype : 'application/x-www-form-urlencoded');
        xhr.send(post);
    }

    return deferred.promise;
};