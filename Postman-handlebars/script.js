const express = require("express");
const path = require('path');
const fs = require('fs');
const fetch = require("isomorphic-fetch");
const hbs = require("hbs");

const webserver = express();

const port = 7480;

const POST = 1;
const GET = 2;

webserver.use(express.json());

webserver.set("view engine", "hbs");

webserver.set('views', path.join(__dirname, 'public'));

hbs.registerPartials(__dirname + "/public/components");

webserver.use(
    express.static(path.resolve(__dirname, "public"))
);

webserver.get('/main-page', (req, res) => {
    let requestList = JSON.parse(fs.readFileSync("requsts-data.json", "utf8"));

    res.render('index.hbs', {
        requests: requestList.data,
    });
});

webserver.post('/save-request-data', async (req, res) => {
    let fileContent = JSON.parse(fs.readFileSync("requsts-data.json", "utf8"));
    fileContent.data.push(setId(req.body))
    fs.writeFileSync("requsts-data.json", JSON.stringify(fileContent));
    res.sendStatus(200);
});

function setId(parsedData) {
    parsedData.id = Math.random();
    parsedData.methodName = +parsedData.methodId === POST ? 'POST' : 'GET';
    return parsedData;
}

webserver.post('/run-request', async (req, res) => {
    let selectedRequest = getRequestById(req.body.requestId)[0];
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
            const fetchPostOptions = {
                method: 'POST',
                headers: buildRequestHeaders(selectedRequest)
            };
            const proxy_post_response = await fetch(selectedRequest.url, fetchPostOptions);
            return createResponse(proxy_post_response, selectedRequest);
            break;
        case GET:
            let url = `${selectedRequest.url}`;
            const fetchGetOptions = {
                method: 'GET'
            };
            if (selectedRequest.keyParam1 && selectedRequest.valueParam1) {
                url += `?${selectedRequest.keyParam1}=${selectedRequest.valueParam1}`;
            }
            if (selectedRequest.keyParam2 || selectedRequest.valueParam2) {
                url += `&${selectedRequest.keyParam2}=${selectedRequest.valueParam2}`;
            }
            const proxy_get_response = await fetch(url, fetchGetOptions);
            return createResponse(proxy_get_response, selectedRequest);
            break;
    }
}

function buildRequestHeaders(selectedRequest) {
    return {
        'Content-Type': selectedRequest.contentType,
        [selectedRequest.headerParam1]: selectedRequest.headerValue1,
        [selectedRequest.headerParam2]: selectedRequest.headerValue2
    }
}

async function createResponse(proxy_get_response, selectedRequest) {
    let contentType = proxy_get_response.headers.get('Content-Type');

    let body = null;
    switch (true) {
        case contentType.includes('text/plain'):
            body = await proxy_get_response.text();
            break;

        case contentType.includes('application/xml'):
            break;

        case contentType.includes('application/json'):
            body = await proxy_get_response.json();
            break;
        default:
            body = await proxy_get_response.text();
            break;
    }
    return JSON.stringify({
        methodId: selectedRequest.methodId,
        url: selectedRequest.url,
        status: proxy_get_response.status,
        contentType: proxy_get_response.headers.get('Content-Type'),
        body: body,
        keyParam1: selectedRequest.keyParam1,
        valueParam1: selectedRequest.valueParam1,
        keyParam2: selectedRequest.keyParam2,
        valueParam2: selectedRequest.valueParam2,
        resHeaders: {
            server: proxy_get_response.headers.get('server'),
            date: proxy_get_response.headers.get('date'),
            connection: proxy_get_response.headers.get('connection'),
            vary: proxy_get_response.headers.get('vary'),
            link: proxy_get_response.headers.get('link')
        }
    });
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
});