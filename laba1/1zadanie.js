const http = require("http"); //для создания сервера
http.createServer(function(request,response){
    //создаётся новый сервер для прослушиваний вх подкл
    response.writeHead(200,{'content-type': 'text/html'});
    response.end('<h1>Hello World!</h1>\n');

}).listen(3000);

console.log("Server running at http://localhost:3000")


