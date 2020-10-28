const http = require('http');

const mainHandler = function (request, response) {
    
    if ( request.url == "/favicon.ico") {
        response.writeHead(200,{'Content-Type':'imaeg/x-con'} );
        response.end();
        //console.log("favicon requested");
        return;
    }

    console.log( request.url  );
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.write("<!doctype html>\n");
    response.write("<html>\n<head>\n");
    response.write("<title>Dice Roller</title>\n");
    response.write("</head>\n<body>\n");
    response.write('<h1>Hello World!</h1>');
    response.write("\n</body>\n</html>");
    response.end();
}

const server = http.createServer( mainHandler );
server.listen(3000, (err) => {
    if (err) {
        console.log("Error ", err );
    }
    console.log("Listening on port 3000");
});

