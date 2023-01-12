const http =require('http');
const url=require('url');
const fs=require('fs');
const {send} = require('./m0602');

http.createServer(function (request,response){
    if(url.parse(request.url).pathname==='/'&&request.method=='GET'){
        let html = fs.readFileSync('./06-02.html');
        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(url.parse(request.url).pathname==='/'&&request.method=='POST'){
        console.log('POST');
        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        request.on('data', data => {
            let r = JSON.parse(data);
            console.log(r);
            console.log(`OK:lilkrug_2003@mail.ru, lilkrug2003@gmail.com,${r.message}`);
            send(r.message)
            response.end(`<h1>OK:lilkrug_2003@mail.ru, lilkrug2003@gmail.com,${r.message}</h1>`);
        });
    }
}).listen(3000);