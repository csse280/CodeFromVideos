let abcTracker = 0;
let totalTracker = 0;
const _ = require("underscore");
const http = require('http');


const abcHandler =  (request, response)  => {
    response.write('<h1>ABC</h1>');
};

const xyzHandler =  (request, response)  => {
    response.write("<!doctype html>\n");
    response.write("<html>\n<head>\n");
    response.write("<title>Dice Roller</title>\n");
    response.write("</head>\n<body>\n");
    response.write('<h1>Hello World!</h1>');
    response.write('<div>abcTracker = '+abcTracker+'</div>');
    response.write('<div>totalTracker = '+totalTracker+'</div>');
    for(let i=0; i< 5; i++) {
        let randNum = _.random(1,6);
        response.write('<p>' + randNum + '</p>');
    }


    response.write("\n</body>\n</html>");
};

const faviconHandler =  (request, response)  => {
    //https://gist.github.com/kentbrew/763822
    response.writeHead(200,{'Content-Type':'image/x-icon'} );
    response.end();
    //console.log("favicon requested");
};


const mainHandler = function (request, response) {
    
    if ( request.url == "/favicon.ico") {
        faviconHandler(request, response );
        return;
    }

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    console.log( request.url  );


    if (request.url == "/abc") {
        abcTracker++;
        abcHandler(request, response );
    }

    let re =/^\/xyz.*/;

    if (   re.test( request.url ) ) {
        xyzHandler(request, response );
    }

    totalTracker++;
    response.end();
}

const server = http.createServer( mainHandler );
server.listen(3000, (err) => {
    if (err) {
        console.log("Error ", err );
    }
    console.log("Listening on port 3000");
});

