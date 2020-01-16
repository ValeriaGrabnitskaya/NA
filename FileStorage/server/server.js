const WebSocket = require('ws');
const path = require('path');
const multer = require('multer'); // для обработки тел запроса в формате multipart/form-data
const progress = require('progress-stream'); // для отслеживания прогресса приёма файла (вариант №1)

const port = 7480;

let clients = []; // здесь будут хэши вида { connection:, lastkeepalive:NNN }

let timer = 0;

// миддлварь для работы с multipart/form-data; если потребуется сохранение загруженных файлов - то в папку uploads
const upload = multer({ dest: path.join(__dirname, "uploads") });

const server = new WebSocket.Server({ port: port }); // создаём сокет-сервер на порту 7480

server.on('connection', connection => { // connection - это сокет-соединение сервера с клиентом

    connection.send('hello from server to client! timer=' + timer); // это сообщение будет отослано сервером каждому присоединившемуся клиенту

    connection.on('message', message => {
        if (message === "KEEP_ME_ALIVE") {
            clients.forEach(client => {
                if (client.connection === connection)
                    client.lastkeepalive = Date.now();
            });
        }
        else {
            const service5file = upload.single('file');
            var fileProgress = progress();
            // const fileLength = +req.headers['content-length']; // берём длину всего тела запроса
            // console.log(fileLength)
            message.pipe(fileProgress); // поток с телом запроса направляем в progress
            // fileProgress.headers = req.headers; // и ставим в progress те же заголовки что были у req

            fileProgress.on('progress', info => {
                console.log('loaded ' + info.transferred + ' bytes of ' + fileLength);
            });

            service5file(fileProgress, connection, async (err) => {
                if (err) return res.status(500);
                console.log('file saved, origin filename=' + fileProgress.file.originalname + ', store filename=' + fileProgress.file.filename);
                connection.send("ok login=" + fileProgress.body.login);
            });
        }
        // console.log('сервером получено сообщение от клиента: ' + message) // это сработает, когда клиент пришлёт какое-либо сообщение
    });

    clients.push({ connection: connection, lastkeepalive: Date.now() });
});

// setInterval(() => {
//     timer++;
//     clients.forEach(client => {
//         if ((Date.now() - client.lastkeepalive) > 12000) {
//             client.connection.terminate(); // если клиент уже давно не отчитывался что жив - закрываем соединение
//             client.connection = null;
//         }
//         else
//             client.connection.send('timer=' + timer);
//     });
//     clients = clients.filter(client => client.connection); // оставляем в clients только живые соединения
// }, 3000);

console.log("web server running on port " + port);
