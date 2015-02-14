module.exports = function() {
    // Pageview tracking
    if (location.hostname !== 'localhost') {
        // Statcounter
        window.sc_project=10277940;
        window.sc_invisible=1;
        window.sc_security="11fc2066";
        window.scJsHost = (("https:" == document.location.protocol) ?
        "https://secure." : "http://www.");

        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'text/javascript');
        scriptTag.setAttribute('src', window.scJsHost + "statcounter.com/counter/counter.js");

        document.head.appendChild(scriptTag);
    }
};
