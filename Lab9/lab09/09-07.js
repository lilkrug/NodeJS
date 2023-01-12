const http = require('http');
const fs = require('fs');
let bound = 'divider';
let body = `--${bound}\r\n`;
body += 'Content-Disposition:form-data; name="file"; Filename="myFile.png"\r\n';
body += 'Content-Type:application/octet-stream\r\n\r\n';

let options =
    {
        host: 'localhost',
        path: `/sixth_seventh`,
        port: 5000,
        method: 'POST',
        headers: {'Content-Type': `multipart/form-data; boundary=${bound}`}
    };
const req = http.request(options);

req.write(body);
let stream = new fs.ReadStream("myFile.jpg");
stream.on('data', (chunk) => {
    req.write(chunk);
});
stream.on('end', () => {
    req.end(`\r\n--${bound}--\r\n`);
});