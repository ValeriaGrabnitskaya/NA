const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var path = require('path');

const webserver = express();

const port = 7480;

webserver.use(express.json());
webserver.use(bodyParser.text());
webserver.use(express.urlencoded({ extended: true }));

webserver.use(
    express.static(path.resolve(__dirname, "public"))
);

webserver.get('/main-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

webserver.post('/saveRequestData', (req, res) => {
    setAndGetDataFromFile(req.body);
});

function setAndGetDataFromFile(data) {
    let fileContent = JSON.parse(fs.readFileSync("requsts-data.json", "utf8"));
    fileContent.data.push(JSON.parse(data))
    fs.writeFileSync("requsts-data.json", JSON.stringify(fileContent));
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 