const udp = require('dgram');

const PORT = 4000;
let server = udp.createSocket('udp4');

server.on('message', (msg, info) => {
    MsgBuff = msg.toString();
    console.log(`Msg ${info.address}:${info.port} = ${MsgBuff}`);
    MsgBuff = `ECHO:${MsgBuff}`;
    server.send(MsgBuff, info.port, info.address);
})


server.bind(PORT);  