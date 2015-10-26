/* global window:false, document:false, CustomEvent:false */

// Custom event polyfill for IE9-IE11
// https://gist.github.com/james2doyle/7945320
(function() {
    'use strict';

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return customEvent;
    }
    CustomEvent.prototype = window.CustomEvent.prototype;
    window.CustomEvent = CustomEvent;
})();

//
// CommonJS-compliant layer of indirection between (general) Socket.IO HTTP server push events and (custom) application client events
// Possible client events emitted are:
//   'connected'
//   'disconnected'
//   'connection-failed'
//   'connection-error'
//   'connection-count({connection-count})
//
var connected = null,
    socket = require('../../node_modules/socket.io/node_modules/socket.io-client/socket.io')(),
    //socket = require('socket.io-client')(), // Also works, but require an additional 'package.json' dependency ...
    trigger = function(eventName) {
        'use strict';
        var event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
        console.log('Socket.IO :: Dispatching \'' + eventName + '\'');
        window.dispatchEvent(event);
    },
    triggerCustomEvent = function(eventName, details) {
        'use strict';
        var customEvent = new CustomEvent(eventName, {
            'detail': details
        });
        console.log('Socket.IO :: Dispatching \'' + eventName + '\'');
        window.dispatchEvent(customEvent);
    };

console.log('Socket.IO :: Connecting to server ...');

socket.on('connect_failed', function() {
    'use strict';
    console.log('Socket.IO :: Event:connect_failed');
    trigger('connection-failed');
    connected = false;
    console.log('Socket.IO :: Connecting to ' + socket.io.uri + ' failed!');
});

socket.on('connect_error', function() {
    'use strict';
    console.log('Socket.IO :: Event:connect_error');
    trigger('connection-error');
    connected = false;
    console.log('Socket.IO :: Connecting to ' + socket.io.uri + ' failed!');
});

socket.on('connect', function() {
    'use strict';
    console.log('Socket.IO :: Event:connect');
    trigger('connected');
    connected = true;
    console.log('Socket.IO :: Connected to ' + socket.io.uri);
});

socket.on('disconnect', function() {
    'use strict';
    console.log('Socket.IO :: Event:disconnect');
    trigger('disconnected');
    connected = false;
    console.log('Socket.IO :: Disconnected from ' + socket.io.uri);
});

socket.on('connection-count', function(connectionCount) {
    'use strict';
    console.log('Socket.IO :: Number of active connections: ' + connectionCount);
    triggerCustomEvent('connection-count', { 'connection-count': connectionCount });
});
