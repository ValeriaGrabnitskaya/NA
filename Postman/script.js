const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fetch = require("isomorphic-fetch");

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

webserver.post('/save-request-data', (req, res) => {
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
    let data = JSON.parse(req.body);
    let selectedRequest = getRequestById(data.requestId)[0];
    const proxy_response = await runFetch(selectedRequest);
    res.send(proxy_response);
});

function getRequestById(requestId) {
    let fileContent = JSON.parse(fs.readFileSync("requsts-data.json", "utf8"));
    return fileContent.data.filter((item) => item.id === requestId);
}

async function runFetch(selectedRequest) {
    switch (+selectedRequest.methodId) {
        case POST:
            console.log('POST')
            const fetchPostOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': selectedRequest.contentType
                }, 
                body: JSON.stringify(getRequestBody(selectedRequest))
            };
            const proxy_post_response = await fetch(`http://localhost:7480/${selectedRequest.url}`, fetchPostOptions);
            return createResponse(proxy_post_response, POST);
            break;
        case GET:
            console.log('get');
            const fetchGetOptions = {
                method: 'GET',
                headers: {
                    Accept: selectedRequest.contentType
                }
            };
            let url = `http://localhost:7480/${selectedRequest.url}`;
            if (selectedRequest.keyParam1 && selectedRequest.valueParam1) {
                url += `?${selectedRequest.keyParam1}=${selectedRequest.valueParam1}`
            }
            if (selectedRequest.keyParam2 && selectedRequest.valueParam2) {
                url += `&${selectedRequest.keyParam2}=${selectedRequest.valueParam2}`
            }
            const proxy_get_response = await fetch(url, fetchGetOptions);
            return createResponse(proxy_get_response, GET);
            break;
    }
}


function getRequestBody(selectedRequest) {
    if (+selectedRequest.methodId === POST) {
        return {
            [selectedRequest.keyBody1]: selectedRequest.valueBody1,
            [selectedRequest.keyBody2]: selectedRequest.valueBody2
        }
    }
}

function createResponse(response, methodId) {
    return {
        methodId: methodId,
        url: response.url,
        status: response.status,
        contentType: response.headers.get('Content-Type')
    }
}

webserver.post('*', async (req, res) => {
    res.sendStatus(200);
});

webserver.get('*', async (req, res) => {
    res.sendStatus(200);
});

webserver.listen(port, () => {
    console.log("web server running on port " + port);
});
