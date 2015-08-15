var path = require('path'),
    express = require('express'),

    applicationAbsolutePath = __dirname,
    clientResourcesRelativePath = '.',
    port = process.env.PORT || 8000,
    appServer;

// Application server configuration
appServer = express();
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
