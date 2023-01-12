const http = require('http');
const query = require('querystring');
const params = query.stringify({x: 3, y: 5, s: 'Hello'});

const option = {
    host: 'localhost',
    path: '/third',
    port: 3000,
    method: 'POST'
};

http.request(option, res => {
    console.log('http.request: statusCode: ', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('body:', data);
    });
}).end(params);