const express = require('express');

var path = require('path');

const webserver = express();

const port = 7480;


webserver.get('/main-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

webserver.get('/stat', (req, res) => {
    res.send({
        data: [
            { id: 1, value: 1 },
            { id: 2, value: 2 },
            { id: 3, value: 3 },
            { id: 4, value: 4 },
            { id: 5, value: 5 }
        ]
    });
});

webserver.get('/variants', (req, res) => {
    res.send({
        data: [
            { id: 1, value: 1 },
            { id: 2, value: 2 },
            { id: 3, value: 3 },
            { id: 4, value: 4 },
            { id: 5, value: 5 }
        ]
    });
});

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 