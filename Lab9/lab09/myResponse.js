const MIME = {
    HTML: Symbol('text/html; charset=utf-8'),
    CSS: Symbol('text/css'),
    JS: Symbol('text/javascript'),
    PNG: Symbol('image/png'),
    DOCX: Symbol('application/msword'),
    JSON: Symbol('application/json'),
    XML: Symbol('application/xml'),
    MP4: Symbol('video/mp4')
};
exports.MIME = MIME;

function getHeader(mime) {
    return { 'Content-Type': mime.description };
}
exports.getHeader = getHeader;

exports.write200 = (res, message, mime) => {
    res.writeHead(200, getHeader(mime));
    res.end(message);
};
exports.write405 = (req, res) => {
    const statusCode = 405;
    res.writeHead(statusCode, getHeader(MIME.HTML));
    res.end(`Error ${statusCode}<br>Request: ${req.method} ${req.url}`);
};
exports.write404 = (req, res) => {
    const statusCode = 404;
    res.writeHead(statusCode, getHeader(MIME.HTML));
    res.end(`Error ${statusCode}<br>Request: ${req.method} ${req.url}`);
};