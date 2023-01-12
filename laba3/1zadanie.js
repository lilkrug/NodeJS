const http = require('http');
const fs = require('fs');
var state = "started";
var url = require('url');

let factorial = (n) => {return (n < 2?n : n*factorial(n-1));}

function Fact(n, cb) {
    this.fn = n;
    this.ffact = factorial;
    this.fcb = cb;
    this.calc = ()=>{process.nextTick(()=>{this.fcb(null, this.ffact(this.fn));});}
}

function Fact1(n, cb) {
    this.fn = n;
    this.ffact = factorial;
    this.fcb = cb;
    this.calc = ()=>{setImmediate(()=>{this.fcb(null, this.ffact(this.fn));});}
}

http.createServer(function (req, res) {
    switch(req.url)
    {
        case '/':
        {
            res.writeHead(200,{'Content-Type': 'text/html'});
            process.stdout.write('\n'+state + '->');
            res.end('<h1>' + state + '</h1>');
            break;
        }
        case '/facH':
        {
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
            res.end(fs.readFileSync('index.html'));
            break;
        }
        default:
        {
            if (url.parse(req.url).pathname === '/fact')
            {
                let k = parseInt(url.parse(req.url, true).query.k);
                if (Number.isInteger(k))
                {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({ k:k, fact: factorial(k)}));
                }
            }
            else if (url.parse(req.url).pathname === '/facti')
            {
                console.log(req.url);
                if (typeof url.parse(req.url, true).query.k != 'undefined' )
                {
                    let k = parseInt(url.parse(req.url, true).query.k);
                    if (Number.isInteger(k))
                    {
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        const d = Date.now();
                        let fact = new Fact(k, (err, result)=>
                        {
                            res.end(JSON.stringify({ k:k, factorial: result, time: (Date.now() -d)  + "ms" }));
                        });
                        fact.calc();
                    }
                }
            }
            else if (url.parse(req.url).pathname === '/facto')
            {
                console.log(req.url);
                if (typeof url.parse(req.url, true).query.k != 'undefined' )
                {
                    let k = parseInt(url.parse(req.url, true).query.k);
                    if (Number.isInteger(k))
                    {
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        const d = Date.now();
                        let fact = new Fact1(k, (err, result)=>
                        {
                            res.end(JSON.stringify({ k:k, factorial: result, time: (Date.now() -d) + "ms" }));
                        });
                        fact.calc();
                    }
                }
            }
            else
            {
                res.write("Page not found");
                res.end;
            }
        }
    }
}).listen(5000, () => console.log('Server running at http://localhost:5000/'))

process.stdin.setEncoding('utf-8');
process.stdin.on('readable',()=>
{
    let inputV = null;
    while((inputV = process.stdin.read()) != null)
    {
        if(inputV.trim() === 'exit')
        {
            process.exit(0);
        }
        else if (inputV.trim() === 'norm' ||
            inputV.trim() === 'test' ||
            inputV.trim() === 'stop' ||
            inputV.trim() === 'idle')
        {
            state = inputV.trim().toLowerCase();
            process.stdout.write(inputV.trim()+'\n' + inputV.trim()+ '->');
        }
        else
        {
            process.stdout.write('Unknow command: ' + inputV.trim()+ '\n');
        }
    }
});


