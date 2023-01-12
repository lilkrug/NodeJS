let http = require('http');
let url = require('url');
let fs = require('fs');
let parseString = require('xml2js').parseString;
let mp = require('multiparty');

let server = http.createServer((request, response)=>{
    let parsedUrl = url.parse(request.url, true);
    let pathUrls = parsedUrl.pathname.split('/');

    if (parsedUrl.pathname === '/connection') {
        let key = Number(parsedUrl.query.set);
        if(Number.isInteger(key)){
            server.keepAliveTimeout = key;
        }
        response.end('Value KeepAliveTimeout: ' + server.keepAliveTimeout);
    } 

    //+
    else if (parsedUrl.pathname == '/headers') {
        response.writeHead(200,{'Content-Type':'text/html;charset=utf-8', 'Client-Header':'1'});
        let rc ='';
        for(key in request.headers) 
            rc+='<h3>'+key+':'+request.headers[key]+'</h3>';
        response.end(rc);
    }
        
    else if (parsedUrl.pathname == '/xml') {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            parseString(data, function(err, result) {
                response.writeHead(200, {'Content-type': 'application/xml'});
                let id = result.request.$.id;
                let sum = 0;
                let concat = '';
                result.request.x.forEach((p) => {
                    sum += parseInt(p.$.value);
                });
                result.request.m.forEach((p) => {
                    concat += p.$.value;
                });

                let responseText = `<response id="33" request="${id}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
                response.end(responseText);
            });
        });
    }    
}).listen(5000);
console.log('Server running at http://localhost:5000/');