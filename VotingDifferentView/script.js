const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var path = require('path');

const webserver = express();

const port = 7480;

webserver.use(express.json());
webserver.use(bodyParser.text());

webserver.use(
    express.static(path.resolve(__dirname, "public"))
);

webserver.get('/main-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

webserver.get('/stat', (req, res) => {
    const clientAccept = req.headers.accept;

    if (clientAccept === "application/json") {
        let fileContent = JSON.parse(fs.readFileSync("votes.txt", "utf8"));
        res.setHeader("Content-Type", "application/json");
        res.send(fileContent);
    }
    else if (clientAccept === "application/xml") {
        let fileContent = JSON.parse(fs.readFileSync("votes.txt", "utf8"));
        res.setHeader("Content-Type", "application/xml");
        res.send(parseToXML(fileContent.data));
    }
    else {
        let fileContent = JSON.parse(fs.readFileSync("votes.txt", "utf8"));
        res.setHeader("Content-Type", "text/plain");
        res.send(parseToText(fileContent.data));
    }
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
    fs.writeFileSync("votes.txt", JSON.stringify({ "data": newFileContent }));
}

function parseToXML(dataArray) {
    var xml = '<data>';
    dataArray.forEach((item) => {
        xml += `<value>${item.id}</value><amount>${item.value}</amount>`
    });
    xml += '</data>';
    return xml;
}

function parseToText(dataArray) {
    var text = '';
    dataArray.forEach((item) => {
        text += `оценка: ${item.id} - количество: ${item.value};</br>`
    });
    return text;
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 