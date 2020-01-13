const WebSocket = require('ws');
const path = require('path');

const port = 7481;

let clients = []; // здесь будут хэши вида { connection:, lastkeepalive:NNN }

let timer = 0;

const server = new WebSocket.Server({ port: port }); // создаём сокет-сервер на порту 7481

server.on('connection', connection => { // connection - это сокет-соединение сервера с клиентом

    connection.send('hello from server to client! timer=' + timer); // это сообщение будет отослано сервером каждому присоединившемуся клиенту

    connection.on('message', message => {
        if (message === "KEEP_ME_ALIVE") {
            clients.forEach(client => {
                if (client.connection === connection)
                    client.lastkeepalive = Date.now();
            });
        }
        else
            console.log('сервером получено сообщение от клиента: ' + message) // это сработает, когда клиент пришлёт какое-либо сообщение
    });

    clients.push({ connection: connection, lastkeepalive: Date.now() });
});

setInterval(() => {
    timer++;
    clients.forEach(client => {
        if ((Date.now() - client.lastkeepalive) > 12000) {
            client.connection.terminate(); // если клиент уже давно не отчитывался что жив - закрываем соединение
            client.connection = null;
            logLineSync(logFN, `[${port}] ` + "один из клиентов отключился, закрываем соединение с ним");
        }
        else
            client.connection.send('timer=' + timer);
    });
    clients = clients.filter(client => client.connection); // оставляем в clients только живые соединения
}, 3000);

console.log("web server running on port " + port);
