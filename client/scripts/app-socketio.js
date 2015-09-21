var connected = null;

var socket = window.io.connect();
console.log("Socket.IO :: Connecting to server ...");

Array.prototype.forEach.call(document.querySelectorAll(".led, .led-description, .number-of-connections"), function(el) {
    el.removeAttribute("hidden");
});


socket.on("connect_failed", function () {
    console.log("Socket.IO :: Event:connect_failed");
    Array.prototype.forEach.call(document.getElementsByClassName("led"), function(el) {
        el.classList.add("fadein-disconnected-led");
    })
    Array.prototype.forEach.call(document.getElementsByClassName("led-description"), function(el) {
        el.classList.add("fadein-disconnected-led-description");
    })
    window.connected = false;
    console.log("Socket.IO :: Connecting to " + window.socket.io.uri + " failed!");
});


socket.on("connect_error", function () {
    console.log("Socket.IO :: Event:connect_error");
    Array.prototype.forEach.call(document.getElementsByClassName("led"), function(el) {
        el.classList.add("fadein-disconnected-led");
    })
    Array.prototype.forEach.call(document.getElementsByClassName("led-description"), function(el) {
        el.classList.add("fadein-disconnected-led-description");
    })
    window.connected = false;
    console.log("Socket.IO :: Connecting to " + window.socket.io.uri + " failed!");
});


socket.on("connect", function () {
    console.log("Socket.IO :: Event:connect");
    Array.prototype.forEach.call(document.getElementsByClassName("led"), function(el) {
        //console.log("Socket.IO :: Event:connect immediately");
        el.classList.remove("fadeout-connected-led");
        el.classList.remove("fadein-disconnected-led");
        if (window.connected === false) {
            el.classList.add("fadeout-disconnected-led");
            setTimeout(function(){
                //console.log("Socket.IO :: Event:connect 1s after (window.connected)");
                el.classList.remove("fadeout-disconnected-led");
                el.classList.add("fadein-connected-led");
            }, 1000)
        } else {
            //console.log("Socket.IO :: Event:connect (window.connected === false)");
            el.classList.add("fadein-connected-led");
        }
    });
    Array.prototype.forEach.call(document.getElementsByClassName("led-description"), function(el) {
        el.classList.remove("fadeout-connected-led-description");
        el.classList.remove("fadein-disconnected-led-description");
        if (window.connected === false) {
            el.classList.add("fadeout-disconnected-led-description");
            setTimeout(function(){
                el.classList.remove("fadeout-disconnected-led-description");
                el.classList.add("fadein-connected-led-description");
            }, 1000)
        } else {
            el.classList.add("fadein-connected-led-description");
        }
    })
    window.connected = true;
    console.log("Socket.IO :: Connected to " + window.socket.io.uri);
});


socket.on("disconnect", function () {
    Array.prototype.forEach.call(document.getElementsByClassName("led"), function(el) {
        el.classList.remove("fadeout-disconnected-led");
        el.classList.remove("fadein-connected-led");
        el.classList.add("fadeout-connected-led");
        setTimeout(function(){
            el.classList.add("fadein-disconnected-led");
        }, 1000)
    });
    Array.prototype.forEach.call(document.getElementsByClassName("led-description"), function(el) {
        el.classList.remove("fadeout-disconnected-led-description");
        el.classList.remove("fadein-connected-led-description");
        el.classList.add("fadeout-connected-led-description");
        setTimeout(function(){
            el.classList.add("fadein-disconnected-led-description");
        }, 1000)
    });
    Array.prototype.forEach.call(document.getElementsByClassName("number-of-connections"), function(el) {
        el.classList.add("fadeout");
        el.classList.remove("fadein");
    });
    window.connected = false;
    console.log("Socket.IO :: Disconnected from " + window.socket.io.uri);
});


socket.on("number-of-connections", function (numberOfConnections) {
    console.log("Socket.IO :: Number of connected users: " + numberOfConnections);
    window.numberOfConnections = numberOfConnections;
    Array.prototype.forEach.call(document.getElementsByClassName("number-of-connections"), function(el) {
        el.classList.add("fadein");
        if (window.numberOfConnections === 1) {
            el.innerText = "you're the only user connected ...";
        } else {
            el.innerText = window.numberOfConnections + " connected users";
        }
        el.classList.remove("fadeout");
    });
});
