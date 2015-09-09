var path = require('path'),
    express = require('express'),
    http = require('http'),
    socketio = require('socket.io'),

    httpServer,

    applicationAbsolutePath = __dirname,
    staticResourcesRelativePath = '../../public',
    port = process.env.PORT || 8000,
    appServer,

    serverPush,
    userCounter = 0; // User connection counter.


// Application server (middleware configuration)
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
// /Application server (middleware configuration)


// HTTP server
httpServer = http.createServer(appServer);
// /HTTP server


// HTTP server push (by Socket.IO)
serverPush = socketio.listen(httpServer);
// /HTTP server push (by Socket.IO)


// Start HTTP server
httpServer.listen(port, function() {
    console.log('HTTP server listening on port %s', port);
});
