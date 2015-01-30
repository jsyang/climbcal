module.exports = function(selector) {
    var loaderOverlay = document.createElement('div');
    loaderOverlay.classList.add('loader-overlay');
    loaderOverlay.innerHTML = '<div class="loader"></div>';
    document.querySelector(selector).appendChild(loaderOverlay);
};