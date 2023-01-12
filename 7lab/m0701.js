const fs = require('fs');

function SendFileMethod(dir){

    this.write404=(response)=>{
        response.statusCode=404;
        response.end("Resource not found");
    }

    let pipeFile = (request,response,headers)=>{
        const filePath = dir + request.url.substr(1);
        response.writeHead(200,headers);
        fs.createReadStream(filePath).pipe(response);
    }

    this.sendFile = (request,response)=>{
        let headers;
        const filePath = dir + request.url.substr(1);
        if (request.url.endsWith('.css')) {
            headers={'Content-Type': 'text/css; charset=utf-8'};
        }
        else if (request.url.endsWith('.html')) {
            headers= {'Content-Type': 'text/html; charset=utf-8'};
        }
        else if (request.url.endsWith('.js')) {
            headers= {'Content-Type': 'text/javascript; charset=utf-8'};
        }
        else if (request.url.endsWith('.png') || request.url.endsWith('.jpg')) {
            headers={'Content-Type': 'image/png; charset=utf-8'};
        }
        else if (request.url.endsWith('.json')) {
            headers= {'Content-Type': 'application/json; charset=utf-8'};
        }
        else if (request.url.endsWith('.xml')) {
            headers= {'Content-Type': 'application/xml; charset=utf-8'};
        }
        else if (request.url.endsWith('.mp4')) {
            headers= {'Content-Type': 'video/mp4; charset=utf-8'};
        }
        else if (request.url.endsWith('.docx')) {
            headers= {'Content-Type': 'application/msword; charset=utf-8'};
        }
        if(request.url!='/') {
            fs.access(filePath, fs.constants.R_OK, err => {
                err ? this.write404(response) : pipeFile(request, response, headers);
            });
        }
        else{
            this.write404(response);
        }
    }
}

module.exports =(dir)=> new SendFileMethod(dir);