function firstLoad() {
    const url = 'ws://localhost:7481';
    let connection = new WebSocket(url); // это сокет-соединение с сервером

    connection.onopen = (event) => {
        connection.send('hello from client to server!'); // можно послать строку, Blob или ArrayBuffer 
    };

    connection.onmessage = function (event) {
        console.log('клиентом получено сообщение от сервера: ' + event.data); // это сработает, когда сервер пришлёт какое-либо сообщение
    }

    connection.onerror = error => {
        console.log('WebSocket error:', error);
    };

    connection.onclose = () => {
        console.log("соединение с сервером закрыто");
        connection = null;
        clearInterval(keepAliveTimer);
    };

    // чтобы сервер знал, что этот клиент ещё жив, будем регулярно слать ему сообщение "я жив"
    let keepAliveTimer = setInterval(() => {
        connection.send('KEEP_ME_ALIVE'); // вот эту строчку бы зашарить с сервером!
    }, 5000); // и это число!
}
