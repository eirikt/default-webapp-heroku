/* global require, window, document, console, CustomEvent */

/* eslint-disable no-console */

/* eslint complexity: [1,1] */
/* eslint newline-after-var: 1 */
/* eslint no-inline-comments: 1 */
/* eslint require-jsdoc: 1 */
/* eslint spaced-comment: 1 */

// Custom event polyfill for IE9-IE11, inspired by: https://gist.github.com/james2doyle/7945320
(function() {
    const CustomEvent = (/* event, params */) => {
        const customEvent = document.createEvent('CustomEvent');
        const event = arguments[0];
        let params = {
            bubbles: false,
            cancelable: false,
            detail: null
        };
        if (arguments.length > 1) {
            params = arguments[1];
        }
        customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return customEvent;
    };
    CustomEvent.prototype = window.CustomEvent.prototype;
    window.CustomEvent = CustomEvent;
}());

//
// CommonJS-compliant layer of indirection between (general) Socket.IO HTTP server push events and (custom) application client events
// Possible client events emitted are:
//   'connected'
//   'disconnected'
//   'connection-failed'
//   'connection-error'
//   'connection-count({connection-count})
//
const socket = require('../../node_modules/socket.io-client/socket.io')();
//const socket = require('socket.io-client')(); // Also works, but require an additional 'package.json' dependency ...

const trigger = (eventName) => {
    const event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    console.log('Socket.IO :: Dispatching \'' + eventName + '\'');
    window.dispatchEvent(event);
};

const triggerCustomEvent = (eventName, details) => {
    const customEvent = new CustomEvent(eventName, {
        'detail': details
    });
    console.log('Socket.IO :: Dispatching \'' + eventName + '\'');
    window.dispatchEvent(customEvent);
};

console.log('Socket.IO :: Connecting to server ...');

socket.on('connect_failed', () => {
    console.log('Socket.IO :: Event:connect_failed');
    trigger('connection-failed');
    window.connected = false;
    console.log('Socket.IO :: Connecting to ' + socket.io.uri + ' failed!');
});

socket.on('connect_error', () => {
    console.log('Socket.IO :: Event:connect_error');
    trigger('connection-error');
    window.connected = false;
    console.log('Socket.IO :: Connecting to ' + socket.io.uri + ' failed!');
});

socket.on('connect', () => {
    console.log('Socket.IO :: Event:connect');
    trigger('connected');
    window.connected = true;
    console.log('Socket.IO :: Connected to ' + socket.io.uri);
});

socket.on('disconnect', () => {
    console.log('Socket.IO :: Event:disconnect');
    trigger('disconnected');
    window.connected = false;
    console.log('Socket.IO :: Disconnected from ' + socket.io.uri);
});

socket.on('connection-count', (connectionCount) => {
    console.log('Socket.IO :: Number of active connections: ' + connectionCount);
    triggerCustomEvent('connection-count', { 'connection-count': connectionCount });
});
