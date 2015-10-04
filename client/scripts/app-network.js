var updateNetworkStatus = function(event) {
    var online = navigator.onLine,
        condition = online ? "online" : "offline";

    console.log("Network :: Event:" + (!event ? "(unknown)" : event.type) + ", Status:" + condition);

    Array.prototype.forEach.call(document.getElementsByClassName("network-status"), function(el) {
        el.classList.remove("fadein-network-status-offline");
        el.classList.remove("fadeout-network-status-offline");
        el.classList.remove("fadein-network-status-online");
        el.classList.remove("fadeout-network-status-online");

        if(online) {
            if(event != null) {
                el.classList.add("fadeout-network-status-offline");
            }
            setTimeout(function() {
                if(event != null) {
                    el.classList.remove("fadeout-network-status-offline");
                }
                el.classList.add("fadein-network-status-online");
            }, 1000)
        } else {
            if(event != null) {
                el.classList.add("fadeout-network-status-online");
            }
            setTimeout(function() {
                if(event != null) {
                    el.classList.remove("fadeout-network-status-online");
                }
                el.classList.add("fadein-network-status-offline");
            }, 1000)
        }
    });
}

updateNetworkStatus();

window.addEventListener("load", function() {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
});
