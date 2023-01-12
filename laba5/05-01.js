var http = require('http');
var url = require('url');
var fs = require('fs');
var util = require('util');
var ee = require('events');
var db_module = require('./db-module');
var db = new db_module.DB();




db.on('GET', (req, res) => {
    ++countOfRequests;
    console.log('GET called');
    res.end(db.select());
});


db.on('POST', (req, res) => {
    ++countOfRequests;
    console.log('POST called');
    req.on('data', data => {
        // console.log('db: ', db.select());
        // const dbdb = JSON.parse(db.select());
        // const t = dbdb.find(user => user.id = data.id);
        // console.log('t = ',t);
        res.end(db.insert(data));
    })
});


db.on('PUT', (req, res) => {
    ++countOfRequests;
    console.log('PUT called');
    req.on('data', data => {
        res.end(db.update(data));
    })
});


db.on('DELETE', (req, res) => {
    ++countOfRequests;
    console.log('DELETE called');
    if (typeof url.parse(req.url, true).query.id != "undefined") {
        console.log("id is not undefined");
        var id = parseInt(url.parse(req.url, true).query.id);
        console.log("id = " + id);
        if (Number.isInteger(id))
            res.end(db.delete(id));
        else
            res.end("ERROR! Id parameter is NaN");
    }
    else res.end("ERROR! The Id parameter is missing");
});


db.on('COMMIT', () => 
{
    ++countOfCommits;
    db.commit(); 
})



let svr = http.createServer((request, response) => {
    switch (url.parse(request.url).pathname)
    {
        case '/api/db': 
            db.emit(request.method, request, response);
            break;
        case '/':
            let html = fs.readFileSync('./04-02.html');
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            response.end(html);
            break;
        case '/api/ss':
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(getStatistics());
            break;
        default:
            response.end('<html><body><h1>Error! Visit localhost:5000/</h1></body></html>');
            break;
    }
}).listen(5000, () => console.log('Server running at localhost:5000/\n'));




let getStatistics = () =>
{
    return JSON.stringify({ 
        start: startDate, 
        finish: endDate, 
        requests: countOfRequests, 
        commits: countOfCommits 
    }, null, 2);
}

let sdTimeout  = null;
let scInterval = null;
let ssTimeout  = null;
let countOfRequests = 0;
let countOfCommits  = 0;
let statistics = JSON.stringify({ start: 0, finish: 0, requests: 0, commits: 0 });
let startDate = null;
let endDate = null;
process.stdin.unref();

let stdin = process.openStdin();
stdin.addListener('data', (cmd) => {
    let arg = cmd.toString().trim();                    // аргумент, переданный в поток консоли stdin
    let command = arg.slice(0, 2);                      // команда: первые 2 символа (sd, sc, ss)
    let number = parseInt(arg.slice(3, 10).trim());     // число, следующее за командой
    let millisecs = number * 1000;                      // число секунд в миллисекундах


    if (command === 'sd' && Number.isInteger(number))   // остановить сервер через x секунд    
    {
        console.log('The server will disconnect in ' + number + ' seconds. Type "sd" to abort');
        sdTimeout = setTimeout(() => {
            console.log('Server disconnected.');
            svr.close();
        }, millisecs);
    }
    else if (arg === 'sd')      // отмена остановки сервера
    {
        console.log('Disconnection aborted.\n');
        clearTimeout(sdTimeout); 
    }


    else if (command === 'sc' && Number.isInteger(number))       // периодическое выполнение commit
    {
        scInterval = setInterval(() => {
            db.emit('COMMIT');
        }, millisecs);
        scInterval.unref();
    }
    else if (arg === 'sc')
    {
        console.log('Commiting stopped.\n');
        clearInterval(scInterval);      // отмена commit
    }


    else if (command === 'ss' && Number.isInteger(number))      // считать статистику в течение x секунд
    {
        countOfCommits = 0;
        countOfRequests = 0;
        startDate = new Date().toLocaleString();
        endDate = null;
        ssTimeout = setTimeout(() => {
            endDate = new Date().toLocaleString();
            statistics = getStatistics();
            console.log(JSON.parse(statistics, null, 2));
        }, millisecs);
        ssTimeout.unref();
    }
    else if (arg === 'ss')      // остановка сбора статистики
    {
        console.log('Statistics collecting stopped.\n');
        clearTimeout(ssTimeout); 
    }
    
    else
        console.log('Unknown command. Possible commands:  sd | sc | ss [integer]\n');
});