/* global setTimeout */

/* eslint-disable no-console */
/* eslint-disable no-inline-comments */
/* eslint-disable no-mixed-requires */
/* eslint-disable no-process-env */

/* eslint no-extra-parens: 1 */
/* eslint no-magic-numbers: 1 */
/* eslint strict: [1, "global"] */

'use strict';

// Environment
const env = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT || 8000);

const applicationRootAbsolutePath = __dirname;
const developmentStaticResourcesRelativePath = '../../build/client'; // Readable and executable
const productionStaticResourcesRelativePath = '../../public'; // Unreadable and executable

const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

let connectionCount = 0;

const staticResourcesAbsolutePath = (env === 'development') ?
    path.join(applicationRootAbsolutePath, developmentStaticResourcesRelativePath) :
    path.join(applicationRootAbsolutePath, productionStaticResourcesRelativePath);


// Application server (Express middleware configuration)
const appServer = express();

// Header setting suggesting the latest rendering engine version of Internet Explorer
appServer.use((request, response, next) => {
    response.setHeader('X-UA-Compatible', 'IE=edge');
    return next();
});

// Default: Header settings suggesting no caching whatsoever
appServer.use((request, response, next) => {
    response.setHeader('Pragma', 'no-cache'); // HTTP 1.0
    response.setHeader('Cache-Control', 'no-cache, must-revalidate'); // HTTP 1.1 (NB! 'no-store' messes up IE AppCache)
    response.setHeader('Expires', '0'); // Proxies
    return next();
});

appServer.use(express.static(staticResourcesAbsolutePath));
// /Application server (Express middleware configuration)


// HTTP server
const httpServer = http.createServer(appServer);
// /HTTP server


// HTTP server push (by Socket.IO)
const serverPush = socketio.listen(httpServer);

serverPush.on('connection', (socket) => {
    connectionCount += 1;
    serverPush.emit('connection-count', connectionCount);
    console.log('Socket.IO: User connected (now ' + connectionCount + ' active connections)');
    socket.on('disconnect', () => {
        connectionCount -= 1;
        console.log('Socket.IO: User disconnected (now ' + connectionCount + ' active connections)');
        serverPush.emit('connection-count', connectionCount);
    });
});

// Just a convenient start message ...
setTimeout(() => {
    console.log('Socket.IO server listening on port %d', port);
}, 200);
// /HTTP server push (by Socket.IO)


// Start HTTP server
httpServer.listen(port, () => {
    console.log('HTTP server listening on port %s', port);
});
