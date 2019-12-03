const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var path = require('path');

const webserver = express();

const port = 7480;

webserver.use(express.json());
webserver.use(bodyParser.text());
webserver.use(express.static(__dirname));

webserver.options('/vote', (req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.send("");
});

webserver.get('/main-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

webserver.get('/stat', (req, res) => {
    let fileContent = JSON.parse(fs.readFileSync("votes.txt", "utf8"));
    res.send(fileContent);
});

webserver.get('/variants', (req, res) => {
    let fileContent = JSON.parse(fs.readFileSync("votes.txt", "utf8"));
    res.send(fileContent);
});

webserver.post('/vote', (req, res) => {

    const contentType = req.headers['content-type'];

    if (contentType === "text/plain") {
        setAndGetDataFromFile(req.body);
        res.status(200).type('text/plain');
        res.send('');
    } else {
        res.send.status(500);
    }
});

function setAndGetDataFromFile(value) {
    const intValue = parseInt(value);
    let fileContent = JSON.parse(fs.readFileSync("votes.txt", "utf8"));
    var newFileContent = fileContent.data.map((item) => {
        if (item.id === intValue) {
            item.value += 1;
        }
        return item;
    });
    fs.writeFileSync("votes.txt", JSON.stringify({"data": newFileContent}));
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 