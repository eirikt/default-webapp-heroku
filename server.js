var path = require('path'),
    express = require('express'),

    applicationAbsolutePath = __dirname,
    clientResourcesRelativePath = '.',
    port = process.env.PORT || 8000,
    appServer;

// Application server configuration
appServer = express();
appServer.use(express.static(path.join(applicationAbsolutePath, clientResourcesRelativePath)));

// Start application server
appServer.listen(port, function () {
    console.log('Application server listening at port %s', port);
});
