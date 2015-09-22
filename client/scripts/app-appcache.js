// Check if a new cache is available on page load
// NB! Expecting global variable 'upgradeMessage' present
var appCache = window.applicationCache;
if (appCache) {
    window.addEventListener("load", function() {
        appCache.addEventListener("updateready", function() {
            if (appCache.status === appCache.UPDATEREADY) {
                // The browser has downloaded a new version of the application
                if (window.confirm(upgradeMessage)) {
                    window.location.reload();
                }
            }
        }, false);
    }, false);
}
