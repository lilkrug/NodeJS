const DB = require('./DB');
const http = require('http');
const url = require('url');
let fs = require('fs');
const { error } = require('console');
const Db = new DB();
const pathStatic = './static/lab14.html';

let pipeFile = (response, headers) => {
    response.writeHead(200, headers);
    fs.createReadStream(pathStatic).pipe(response);
};

let GET_handler = (req, res) => {
    if (RegExp(/^\/api\/faculty\/.*\/pulpits/).test(url.parse(req.url).pathname)) {
        x = url.parse(req.url).pathname.split('/')[3];
        console.log(x);
        Db.get_PulpitByFac(x).then(records => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.end(JSON.stringify(records.recordset))
        }).catch(error => {write_error_400(res, error)});
        console.log("!!!!!!!!!!");
    }
    if (RegExp(/^\/api\/auditoriumtypes\/.*\/auditoriums/).test(url.parse(req.url).pathname)) {
        x = url.parse(req.url).pathname.split('/')[3];
        console.log(x);
        Db.get_AuditorimByType(x).then(records => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.end(JSON.stringify(records.recordset))
        }).catch(error => {write_error_400(res, error)});
        console.log("!!!!!!!!!!");
    }
    switch (url.parse(req.url).pathname) {
        case '/':
            fs.access(pathStatic, fs.constants.R_OK, err => {
                    if(err) this.writeHTTP404(res);
                    else pipeFile(res,{'Content-Type':'text/html; charset=utf-8'});
                });
            break;
        case '/api/faculties':
                Db.get_Faculties().then(records => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    res.end(JSON.stringify(records.recordset))
                }).catch(error => {write_error_400(res, error)});
            break;
        case '/api/pulpits':
            Db.get_Pulpits().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', '*');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
            break;
        case '/api/subjects':
            Db.get_Subjects().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', '*');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
            break;
        case '/api/auditoriumstypes':
            Db.get_Auditoriums_Types().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', '*');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
            break;
        case '/api/auditorims':
            Db.get_Auditorims().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', '*');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => {write_error_400(res, error)});
            break;
            default:
                //write_error_400(res,"wrong url");
                break;
    }
}

let POST_handler = (req, res) => {
    let data_json = '';
    switch (url.parse(req.url).pathname) {
        case '/api/faculties':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.post_Faculties(data_json.FACULTY, data_json.FACULTY_NAME).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/pulpits':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.post_Pulpits(data_json.PULPIT, data_json.PULPIT_NAME, data_json.FACULTY).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/subjects':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.post_Subjects(data_json.SUBJECT, data_json.SUBJECT_NAME, data_json.PULPIT).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/auditoriumstypes':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.post_Auditoriums_Types(data_json.AUDITORIUM_TYPE, data_json.AUDITORIUM_TYPENAME).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/auditorims':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.post_Auditoriums(data_json.AUDITORIUM, data_json.AUDITORIUM_NAME, data_json.AUDITORIUM_CAPACITY, data_json.AUDITORIUM_TYPE).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
            default:
                write_error_400(res,"wrong url");
                break;
    }
}

let PUT_handler = (req, res) => {
    let data_json = '';
    switch (url.parse(req.url).pathname) {
        case '/api/faculties':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.get_Faculty(data_json.FACULTY).
                then((res)=>{if(res.recordset.length == 0) throw 'No such faculty'}).
                catch(error=>{write_error_400(res,error)});
                Db.put_Faculties(data_json.FACULTY, data_json.FACULTY_NAME).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/pulpits':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                Db.get_Pulpit(data_json.PULPIT).
                then((res)=>{if(res.recordset.length == 0) throw 'No such pulpit'}).
                catch(error=>{write_error_400(res,error)});
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.put_Pulpits(data_json.PULPIT, data_json.PULPIT_NAME, data_json.FACULTY).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/subjects':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.get_Subject(data_json.SUBJECT).
                then((res)=>{if(res.recordset.length == 0) throw 'No such subject'}).
                catch(error=>{write_error_400(res,error)});
                Db.put_Subjects(data_json.SUBJECT, data_json.SUBJECT_NAME, data_json.PULPIT).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/auditoriumstypes':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                Db.put_Auditoriums_Types(data_json.AUDITORIUM_TYPE, data_json.AUDITORIUM_TYPENAME).then(records => {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(data_json));
                }).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/auditorims':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                Db.get_Auditorim(data_json.AUDITORIUM).
                then((res)=>{if(res.recordset.length == 0) throw 'No such auditorium'}).
                catch(error=>{write_error_400(res,error)});
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.put_Auditoriums(data_json.AUDITORIUM, data_json.AUDITORIUM_NAME, data_json.AUDITORIUM_CAPACITY, data_json.AUDITORIUM_TYPE).then(records => {
                    res.end(JSON.stringify(data_json))
                }).catch(error => {write_error_400(res, error)});
            });
            break;
            default:
                write_error_400(res,"wrong url");
                break;
    }
}

let DELETE_handler = (req, res) => {
    let path = decodeURI(url.parse(req.url).pathname);
    let path_mas= path.split('/');
    switch ('/api/' + path_mas[2]) {
        case '/api/faculties':
            res.writeHead(200, {'Content-Type': 'application/json'});
            Db.get_Faculty(path_mas[3]).
                then((res)=>{if(res.recordset.length == 0) throw 'No such faculty'}).
                catch(error=>{write_error_400(res,error)});
            Db.delete_Faculties(path_mas[3]).then(records => {
                res.end('deleted')
            }).catch(error => {write_error_400(res, error)});
            break;
        case '/api/pulpits':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            Db.get_Pulpit(path_mas[3]).
            then((res)=>{if(res.recordset.length == 0) throw 'No such pulpit'}).
            catch(error=>{write_error_400(res,error)});
            Db.delete_Pulpits(path_mas[3]).then(records => {
                res.end('deleted')
            }).catch(error => {write_error_400(res, error)});
            break;
        case '/api/subjects':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            Db.get_Subject(path_mas[3]).
            then((res)=>{if(res.recordset.length == 0) throw 'No such subject'}).
            catch(error=>{write_error_400(res,error)});
            Db.delete_Subjects(path_mas[3]).then(records => {
                res.end('deleted')
            }).catch(error => {write_error_400(res, error)});
            break;
        case '/api/auditoriumstypes':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            Db.delete_Auditoriums_Types(path_mas[3]).then(records => {
                res.end('deleted')
            }).catch(error => {write_error_400(res, error)});
            break;
        case '/api/auditorims':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            Db.get_Faculty(path_mas[3]).
            then((res)=>{if(res.recordset.length == 0) throw 'No such auditorium'}).
            catch(error=>{write_error_400(res,error)});
            Db.delete_Auditoriums(path_mas[3]).then(records => {
                res.end('deleted')
            }).catch(error => {write_error_400(res, error)});
            break;
        default:
            write_error_400(res,"wrong url");
            break;
    }
}

function write_error_400(res, error) {
    res.statusCode = 400;
    res.statusMessage = 'Invalid method';
    res.end('<h1>error</h1></br>'+'<h3>'+error+'</h3>');
}


let http_handler = (req, res) => {

    console.log(req.method);
    switch (req.method) {
        case 'GET':
            GET_handler(req, res);
            break;
        case 'POST':
            POST_handler(req, res);
            break;
        case 'PUT':
            PUT_handler(req, res);
            break;
        case 'DELETE':
            DELETE_handler(req, res);
            break;
        default:
            write_error_400(res, 'Wrong method');
            break;
    }
}



let server = http.createServer();
server.listen(3000, () => {
    console.log('server.listen(3000)')
}).on('request', http_handler);

server.on('connection', (sock) => {

    sock.on('close', data => {
        //console.log('Connection closed');
    });

    sock.on('error', (e) => {
        console.log(`Server error: ${e}`);
    });
});
