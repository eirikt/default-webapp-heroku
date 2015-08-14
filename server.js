var http = require('http'),
    port = process.env.PORT || 8000,
    server = http.createServer(function(request, response) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write('<html>');
        response.write('<head>');
        response.write('<title>Hello World</title>');
        response.write('</head>');
        response.write('<body>');
        response.write('Hello World!');
        response.write('</body>');
        response.write('</html>');
        response.end();
    });

server.listen(port);
console.log('HTTP server is listening on port %s', port);
