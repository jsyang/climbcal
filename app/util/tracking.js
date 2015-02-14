module.exports = function() {
    // Pageview tracking
    if (location.hostname !== 'localhost') {
        // Statcounter
        var sc_project=10277940;
        var sc_invisible=1;
        var sc_security="11fc2066";
        var scJsHost = (("https:" == document.location.protocol) ?
        "https://secure." : "http://www.");

        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'text/javascript');
        scriptTag.setAttribute('src', scJsHost + "statcounter.com/counter/counter.js");
        
        document.head.appendChild(scriptTag);
    }
};
