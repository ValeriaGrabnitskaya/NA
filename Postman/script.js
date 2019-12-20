const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var path = require('path');

const webserver = express();

const port = 7480;

const POST = 1;
const GET = 2;

webserver.use(express.json());
webserver.use(bodyParser.text());
webserver.use(express.urlencoded({ extended: true }));

webserver.use(
    express.static(path.resolve(__dirname, "public"))
);

webserver.get('/main-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

webserver.get('/requests-list', (req, res) => {
    let fileContent = JSON.parse(fs.readFileSync("requsts-data.json", "utf8"));
    res.send(fileContent);
});

webserver.post('/saveRequestData', (req, res) => {
    let fileContent = JSON.parse(fs.readFileSync("requsts-data.json", "utf8"));
    var parsedData = JSON.parse(req.body);
    fileContent.data.push(setId(parsedData))
    fs.writeFileSync("requsts-data.json", JSON.stringify(fileContent));
    res.send(200);
});

function setId(parsedData) {
    parsedData.id = Math.random();
    parsedData.methodName = +parsedData.methodId === POST ? 'POST' : 'GET';
    return parsedData;
}

webserver.post('/run-request', async (req, res) => { 
    let selectedRequest = getRequestById(req.body.requestId)[0];

    const proxy_response=await fetch(`http://localhost:7481/${selectedRequest.url}`);
    const proxy_json=await proxy_response.json();
console.log(proxy_json)
    // res.send(proxy_text);
});

function getRequestById(requestId) {
    let fileContent = JSON.parse(fs.readFileSync("requsts-data.json", "utf8"));
    return fileContent.data.filter((item) => item.id === requestId);
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 