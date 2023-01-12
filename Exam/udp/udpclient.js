const udp = require('dgram');
const PORT = 4000;

let client = udp.createSocket('udp4');

client.on('message', (msg, info) => {
    MsgBuff = msg.toString();
    console.log(`Server ${info.address}:${info.port} = ${MsgBuff}`);
});

client.send('Hello there', PORT, 'localhost');