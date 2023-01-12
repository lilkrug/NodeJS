

var http = require('http');
var url = require('url');
var fs = require('fs');

let http_handler=(req,res)=>
{
    if(req.method=='POST')
    {
		if(url.parse(req.url).pathname=== '/JSON')
		{
			let result='';
			let body='';
			req.on('data',chunk=>{body+=chunk.toString();});
			req.on('end',()=>{
                try{
				let os = JSON.parse(body);
				console.log(os);
				result={
					age:os.age,
                    name:os.name
				};}
                catch(e){
                    console.error('not valid json')};
                // создаём файл
                fs.writeFileSync('data.json', JSON.stringify(result));

                // // берём старые данные
                // const dbData = JSON.parse(fs.readFileSync('data.json', (err, data) => (data)))

                // читаем файл
                const text = fs.readFileSync('data.json', 'utf8');
                console.log(JSON.parse(text));


				res.writeHead(200,{'Content-Type': 'application/json'});
				console.log(result);
				res.end(JSON.stringify(result));
                
			});
            // req.on('error', (e)=> {console.log('http.request: error:', e.message);})
			}
    }
}
http.createServer(function (req, res){http_handler(req,res);
}).listen(5000);




