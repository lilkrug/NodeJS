const WebSocket = require('ws');

const ws = new WebSocket('ws:/localhost:4000/ws');
let k=0;
let messageInterval;
ws.on('open',()=>{    //открытие соед
    console.log('Socket opened');
    messageInterval = setInterval(()=>{
        ws.send(`10-01-client:${++k}`); //отправка данных
    }, 3000);
    ws.on('message',(message)=>{ //получ данные
        console.log(`${message}`);
    })
    setTimeout(()=>{
        clearInterval(messageInterval);
        ws.close();
    }, 25000);
})
ws.on('close', () => { console.log('Socket closed');}); //закрытие соед
ws.on('error', (error) => {alert('Error '+ error.message);}); //ошибка