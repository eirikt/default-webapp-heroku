// Custom event polyfill for IE9-IE11
// https://gist.github.com/james2doyle/7945320
(function() {
    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = window.CustomEvent.prototype;
    window.CustomEvent = CustomEvent;
})();

var connected = null,
    socket = window.io.connect(),
    trigger = function(eventName) {
        var event = document.createEvent("Event");
        event.initEvent(eventName, true, true);
        console.log("Socket.IO :: Dispatching \"" + eventName + "\"");
        window.dispatchEvent(event);
    };

console.log("Socket.IO :: Connecting to server ...");

socket.on("connect_failed", function() {
    console.log("Socket.IO :: Event:connect_failed");
    trigger("connection-failed");
    connected = false;
    console.log("Socket.IO :: Connecting to " + window.socket.io.uri + " failed!");
});

socket.on("connect_error", function() {
    console.log("Socket.IO :: Event:connect_error");
    trigger("connection-error");
    connected = false;
    console.log("Socket.IO :: Connecting to " + window.socket.io.uri + " failed!");
});

socket.on("connect", function() {
    console.log("Socket.IO :: Event:connect");
    trigger("connected");
    connected = true;
    console.log("Socket.IO :: Connected to " + window.socket.io.uri);
});

socket.on("disconnect", function() {
    console.log("Socket.IO :: Event:disconnect");
    trigger("disconnected");
    connected = false;
    console.log("Socket.IO :: Disconnected from " + window.socket.io.uri);
});

socket.on("connection-count", function(connectionCount) {
    console.log("Socket.IO :: Number of active connections: " + connectionCount);
    window.connectionCount = connectionCount;
    var event = new CustomEvent("connection-count", {
        "detail": {
            "connection-count": connectionCount
        }
    });
    console.log("Socket.IO :: Dispatching \"connection-count\"");
    window.dispatchEvent(event, {
        "connectionCount": connectionCount
    });
});
