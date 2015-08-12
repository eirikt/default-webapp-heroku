var http = require('http'),
    port = process.env.PORT || 8000,
    server = http.createServer(function(request, response) {
        response.writeHead(200);
        response.end();
    });

server.listen(port);
console.log('HTTP server is listening on port %s', port);
