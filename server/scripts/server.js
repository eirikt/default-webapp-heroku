// Environment
var env = process.env.NODE_ENV || 'development',
    port = Number(process.env.PORT || 8000),

    applicationRootAbsolutePath = __dirname,
    developmentStaticResourcesRelativePath = '../../build/client', // Executable and readable
    productionStaticResourcesRelativePath = '../../public', // Executable and unreadable

    path = require('path'),
    express = require('express'),
    http = require('http'),
    socketio = require('socket.io'),

    httpServer,
    appServer,
    serverPush,
    connectionCount = 0,
    staticResourcesAbsolutePath = (env === 'development') ?
        path.join(applicationRootAbsolutePath, developmentStaticResourcesRelativePath) :
        path.join(applicationRootAbsolutePath, productionStaticResourcesRelativePath);


// Application server (Express middleware configuration)
appServer = express();

// Header setting suggesting the latest rendering engine version of Internet Explorer
appServer.use(function(request, response, next) {
    'use strict';
    response.setHeader('X-UA-Compatible', 'IE=edge');
    return next();
});

// Default: Header settings suggesting no caching whatsoever
appServer.use(function(request, response, next) {
    'use strict';
    response.setHeader('Pragma', 'no-cache'); // HTTP 1.0
    response.setHeader('Cache-Control', 'no-cache, must-revalidate'); // HTTP 1.1 (NB! 'no-store' messes up IE AppCache)
    response.setHeader('Expires', '0'); // Proxies
    return next();
});

appServer.use(express.static(staticResourcesAbsolutePath));
// /Application server (Express middleware configuration)


// HTTP server
httpServer = http.createServer(appServer);
// /HTTP server


// HTTP server push (by Socket.IO)
serverPush = socketio.listen(httpServer);

serverPush.on('connection', function(socket) {
    'use strict';
    connectionCount += 1;
    serverPush.emit('connection-count', connectionCount);
    console.log('Socket.IO: User connected (now ' + connectionCount + ' active connections)');
    socket.on('disconnect', function() {
        connectionCount -= 1;
        console.log('Socket.IO: User disconnected (now ' + connectionCount + ' active connections)');
        serverPush.emit('connection-count', connectionCount);
    });
});

// Just a convenient start message ...
setTimeout(function() {
    'use strict';
    console.log('Socket.IO server listening on port %d', port);
}, 200);
// /HTTP server push (by Socket.IO)


// Start HTTP server
httpServer.listen(port, function() {
    'use strict';
    console.log('HTTP server listening on port %s', port);
});
