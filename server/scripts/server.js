var path = require('path'),
    express = require('express'),

    applicationAbsolutePath = __dirname,
    staticResourcesRelativePath = '../../public',
    port = process.env.PORT || 8000,
    appServer;

// Application server middleware configuration
appServer = express();

// Header setting suggesting the latest rendering engine version of Internet Explorer
appServer.use(function(request, response, next) {
    response.setHeader("X-UA-Compatible", "IE=edge");
    return next();
});

// Default: Header settings suggesting no caching whatsoever
appServer.use(function(request, response, next) {
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
    response.setHeader("Expires", "0"); // Proxies
    return next();
});

// Setting the root folder and serving static content
appServer.use(express.static(path.join(applicationAbsolutePath, staticResourcesRelativePath)));
// /Application server middleware configuration

// Start application server
appServer.listen(port, function() {
    console.log('Application server listening at port %s', port);
});
