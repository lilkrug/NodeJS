const http = require('http');
const fs = require('fs');

http.createServer(function (request,response){
    const fname = './mur.jpg';
    let jpg = null;

    fs.stat(fname,(err,stat)=>
    {
        if(err)
        {
            console.log(('error: ',err))
        }
        else{
            jpg = fs.readFileSync(fname);
            response.writeHead(200,{'Content-type': 'image/jpeg','Content-Lenght': stat.size})
            response.end(jpg,'binary');
        }
    });
}).listen(5000)

console.log('Server running at http://localhost:5000/');