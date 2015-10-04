var connected = null;

var socket = window.io.connect();
console.log("Socket.IO :: Connecting to server ...");

socket.on("connect_failed", function() {
    console.log("Socket.IO :: Event:connect_failed");
    Array.prototype.forEach.call(document.getElementsByClassName("connection-status"), function(el) {
        el.classList.remove("fadein-connection-status-disconnected");
        el.classList.remove("fadeout-connection-status-disconnected");
        el.classList.remove("fadein-connection-status-connected");
        el.classList.remove("fadeout-connection-status-connected");
        el.classList.add("fadein-connection-status-disconnected");
    })

    Array.prototype.forEach.call(document.getElementsByClassName("connected"), function(el) {
        el.classList.remove("fadein");
        el.classList.remove("fadeout");
        el.classList.add("fadeout");
    })

    window.connected = false;
    console.log("Socket.IO :: Connecting to " + window.socket.io.uri + " failed!");
});

socket.on("connect_error", function() {
    console.log("Socket.IO :: Event:connect_error");
    Array.prototype.forEach.call(document.getElementsByClassName("connection-status"), function(el) {
        el.classList.remove("fadein-connection-status-disconnected");
        el.classList.remove("fadeout-connection-status-disconnected");
        el.classList.remove("fadein-connection-status-connected");
        el.classList.remove("fadeout-connection-status-connected");
        el.classList.add("fadein-connection-status-disconnected");
    })

    Array.prototype.forEach.call(document.getElementsByClassName("connected"), function(el) {
        el.classList.remove("fadein");
        el.classList.remove("fadeout");
        el.classList.add("fadeout");
    })

    window.connected = false;
    console.log("Socket.IO :: Connecting to " + window.socket.io.uri + " failed!");
});

socket.on("connect", function() {
    console.log("Socket.IO :: Event:connect");
    Array.prototype.forEach.call(document.getElementsByClassName("connection-status"), function(el) {
        el.classList.remove("fadein-connection-status-disconnected");
        el.classList.remove("fadeout-connection-status-disconnected");
        el.classList.remove("fadein-connection-status-connected");
        el.classList.remove("fadeout-connection-status-connected");

        if(window.connected === false) {
            el.classList.add("fadeout-connection-status-disconnected");
            setTimeout(function() {
                el.classList.remove("fadeout-connection-status-disconnected");
                el.classList.add("fadein-connection-status-connected");
            }, 1000)
        } else {
            el.classList.add("fadein-connection-status-connected");
        }
    });

    Array.prototype.forEach.call(document.getElementsByClassName("connected"), function(el) {
        el.classList.remove("fadeout");
        el.classList.add("fadein");
        setTimeout(function() {
            el.removeAttribute("hidden");
        }, 1000)
    })

    window.connected = true;
    console.log("Socket.IO :: Connected to " + window.socket.io.uri);
});

socket.on("disconnect", function() {
    console.log("Socket.IO :: Event:connect");
    Array.prototype.forEach.call(document.getElementsByClassName("connection-status"), function(el) {
        el.classList.remove("fadein-connection-status-disconnected");
        el.classList.remove("fadeout-connection-status-disconnected");
        el.classList.remove("fadein-connection-status-connected");
        el.classList.remove("fadeout-connection-status-connected");

        if(window.connected === true) {
            el.classList.add("fadeout-connection-status-connected");
            setTimeout(function() {
                el.classList.remove("fadeout-connection-status-connected");
                el.classList.add("fadein-connection-status-disconnected");
            }, 1000)
        } else {
            el.classList.add("fadein-connection-status-disconnected");
        }
    });

    Array.prototype.forEach.call(document.getElementsByClassName("connected"), function(el) {
        el.classList.remove("fadein");
        el.classList.add("fadeout");
        setTimeout(function() {
            el.setAttribute("hidden", "true");
            el.classList.remove("fadeout");
        }, 1000)
    })

    window.connected = false;
    console.log("Socket.IO :: Disconnected from " + window.socket.io.uri);
});

socket.on("connection-count", function(connectionCount) {
    console.log("Socket.IO :: Number of active connections: " + connectionCount);
    window.connectionCount = connectionCount;
    Array.prototype.forEach.call(document.getElementsByClassName("connection-count"), function(el) {
        el.classList.add("fadein");
        if(window.connectionCount === 1) {
            el.innerText = "You're the only user connected ...";
        } else {
            el.innerText = window.connectionCount + " active connections";
        }
        el.classList.remove("fadeout");
    });
});
