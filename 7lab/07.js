let http = require('http');

let SendFile = require('./m0701')('static/');
http.createServer(function(request, response) {
    if(request.method==='GET') {
        console.log(request.url);
        SendFile.sendFile(request,response);
    }
    else
    {
        console.log("405 error")
        response.writeHead(405);
        response.end("Метод отличный от GET");
    }
}).listen(3000);