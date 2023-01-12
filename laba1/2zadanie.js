const http = require("http");
function writeHeaders(require)
{
    var head = "";
    for(key in require.headers)
    {
        head += "<p>" + key + ": " + require.headers[key];
    }
    return head;
}

http.createServer( function(request, response)
    {
        let b='';
        request.on('data', str=>{b+=str; console.log('data',b);})
        response.writeHead(200,{'Content-Type': 'text/html'});
        request.on('end', () => {
            response.write(
                '<!DOCTYPE html> <html><head></head>' +
                '<body>' +
                '<h1>Request structure</h1>' +
                '<h2>' + 'method:' + request.method + '</h2>' +
                '<h2>' + 'uri: ' + request.url + '</h2>' +
                '<h2>' + 'version: ' + request.httpVersion + '</h2>' +
                '<h2>' + 'header: ' + writeHeaders(request) + '</h2>' +
                '<h2>' + 'body: ' + b + '</h2>' +
                '</body></html>'
            );
            response.end();
        })
    }
).listen(3000);
console.log("Сервер запущен http://localhost:3000/");
