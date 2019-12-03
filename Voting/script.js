const express = require('express');
const { body } = require('express-validator');
const fs = require('fs');

var path = require('path');

const webserver = express();

const port = 7480;

webserver.use(express.json());
webserver.use(express.urlencoded({ extended: true }));

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

webserver.post('/vote', [body('vote').not().isEmpty()], (req, res) => {
    setAndGetDataFromFile(req.body);
    res.status(200);
    res.send();
});

function setAndGetDataFromFile(body) {
    const intValue = parseInt(body.vote);
    let fileContent = JSON.parse(fs.readFileSync("votes.txt", "utf8"));
    var newFileContent = fileContent.data.map((item) => {
        if (item.id === intValue) {
            item.value += 1;
        }
        return item;
    });
    console.log(JSON.stringify({ "data": newFileContent }))
    fs.writeFileSync("votes.txt", JSON.stringify({ "data": newFileContent }));
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 