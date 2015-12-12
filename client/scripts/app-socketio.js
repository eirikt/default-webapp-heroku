/* global require, window, document, console, CustomEvent */

/* eslint-disable newline-after-var */
/* eslint-disable no-console */

/* eslint complexity: [2, 2] */
/* eslint no-inline-comments: 1 */
/* eslint require-jsdoc: 1 */
/* eslint spaced-comment: 1 */


// Custom event polyfill for IE9-IE11, inspired by: https://gist.github.com/james2doyle/7945320
(function() {
    const CustomEvent = function(/* event, params */) {
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

const trigger = (eventName) => {
    const event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    console.log('Socket.IO :: Dispatching \'' + eventName + '\'');
    window.dispatchEvent(event);
};

const triggerCustomEvent = (eventName, details) => {
    const customEvent = new CustomEvent(eventName, {
        detail: details
    });
    console.log('Socket.IO :: Dispatching \'' + eventName + '\'');
    window.dispatchEvent(customEvent);
};

const handleEvent = function(eventName, connected, logMessage) {
    console.log('Socket.IO :: ' + logMessage);
    trigger(eventName);
    window.connected = connected;
};

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
//const socket = require('socket.io-client')(); // Also works, but requires an additional 'package.json' dependency ...

console.log('Socket.IO :: Connecting to server ...');

socket.on('connect_failed', handleEvent.bind(null, 'connection-failed', false, 'Connecting to ' + socket.io.uri + ' failed!'));
socket.on('connect_error', handleEvent.bind(null, 'connection-error', false, 'Connecting to ' + socket.io.uri + ' failed!'));
socket.on('connect', handleEvent.bind(null, 'connected', true, 'Connected to ' + socket.io.uri));
socket.on('disconnect', handleEvent.bind(null, 'disconnected', false, 'Disconnected from ' + socket.io.uri));
socket.on('connection-count', (connectionCount) => {
    console.log('Socket.IO :: Number of active connections: ' + connectionCount);
    triggerCustomEvent('connection-count', {
        connectionCount: connectionCount
    });
});
