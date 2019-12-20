const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var path = require('path');

const webserver = express();

const port = 7480;

let key = 0;

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
    let fileContent = JSON.parse(fs.readFileSync("requsts-data.json", "utf8"));
    var parsedData = JSON.parse(req.body);
    fileContent.data.push(setId(parsedData))
    fs.writeFileSync("requsts-data.json", JSON.stringify(fileContent));
    res.send(fileContent);
});

function setId(parsedData) {
    parsedData.id = key;
    key += 1;
    return parsedData;
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 