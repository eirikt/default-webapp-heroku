var path = require('path'),
    express = require('express'),

    applicationAbsolutePath = __dirname,
    clientResourcesRelativePath = '.',
    port = process.env.PORT || 8000,
    appServer;

// Application server configuration
appServer = express();
// Default: Header settings suggesting no caching whatsoever
appServer.use(function(request, response, next) {
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
    response.setHeader("Expires", "0"); // Proxies
    return next();
});
appServer.use(express.static(path.join(applicationAbsolutePath, clientResourcesRelativePath)));

// (Empty) Favicon trick to avoid '404 Not Found' in browsers
appServer.get('/favicon.ico', function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'image/x-icon'
    });
    response.end();
});

// Start application server
appServer.listen(port, function () {
    console.log('Application server listening at port %s', port);
});
