const WebSocket = require('ws');

const ws = new WebSocket.Server({port: 8080}, () => {
  console.log('socket start');
});

let clients = [];
ws.on('connection', (client) => {
  clients.push(client);
  console.log(clients.length)

  client.on('message', (msg) => {
    console.log('来自前端的数据：' + msg);
    client.send('来自服务端');
  });

  client.on('close', (msg) => {
    console.log('前端主动断开连接' + msg);
  })
});

