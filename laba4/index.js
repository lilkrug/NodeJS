const http = require("http");
const url = require('url');
const fs = require('fs');
const data = require('./DB/DB');

var db = new data.DB();

db.on('GET', (req,res)=>{console.log('DB.GET'); res.end(JSON.stringify(db.select()));})
db.on('POST', (req,res)=>{console.log('DB.POST');
                        req.on('data', data=>{
                            let r = JSON.parse(data);
                            db.insert(r);
                            res.end(JSON.stringify(r));
                        });
});

db.on('PUT',  (req,res)=> {console.log('DB.PUT');
        req.on('data' , data => {
            let r = JSON.stringify(data);
            db.put(r);
            res.end(JSON.stringify(db.update(r)))
        });
});

db.on('DELETE',  (req,res)=> {console.log('DB.DELETE')
    req.on('data' , data => {
        let r = JSON.stringify(data);
        db.put(r);
        res.end(JSON.stringify(db.delete(r)))
    });
});

http.createServer(function (req, res) {
    if (url.parse(req.url).pathname === '/') {
        let html = fs.readFileSync('./index.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(html);
    } else if (url.parse(req.url).pathname === '/api/db') {
        db.emit(req.method, req, res);
    }
}).listen(5000)