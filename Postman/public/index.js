function firstPageLoad() {
    getRequestsList();
}

async function getRequestsList() {
    const fetchOptions = {
        method: "get",
    };
    const response = await fetch('/requests-list', fetchOptions);
    const data = await response.json();
    buildRequestBlock(data);
}

function resetForm() {
    document.getElementById('methodId').value = '',
        document.getElementById('url').value = '',
        document.getElementById('status').value = '',
        document.getElementById('keyParam1').value = '',
        document.getElementById('valueParam1').value = '',
        document.getElementById('keyParam2').value = '',
        document.getElementById('valueParam2').value = '',
        document.getElementById('contentType').value = '',
        document.getElementById('body').value = ''
}

async function submitForm() {
    const fetchOptions = {
        method: "post",
        body: JSON.stringify(this.getFormData())
    };
    const response = await fetch('/save-request-data', fetchOptions);
    if (response.status = 200) {
        getRequestsList();
        resetForm();
    }
}

function getFormData() {
    return {
        methodId: document.getElementById('methodId').value,
        url: document.getElementById('url').value,
        keyParam1: document.getElementById('keyParam1').value,
        valueParam1: document.getElementById('valueParam1').value,
        keyParam2: document.getElementById('keyParam2').value,
        valueParam2: document.getElementById('valueParam2').value,
        contentType: document.getElementById('contentType').value,
        body: document.getElementById('body').value
    }
}

function buildRequestBlock(response) {
    let requestBlock = '';
    response.data.forEach((item, index) => {
        requestBlock += `<tr><td>${item.methodName}</td><td>${item.url}</td><td><input type="button" value="Отправить" onclick="executeService(${item.id})"/></td></tr>`
    })
    var requestDiv = document.getElementById('requestBlock');
    requestDiv.innerHTML = requestBlock;
}

async function executeService(requestId) {
    const fetchOptions = {
        method: "post",
        body: JSON.stringify({ requestId: requestId })
    };
    const response = await fetch('/run-request', fetchOptions);
    const data = await response.json();
    setDataToForm(data);
}

function setDataToForm(data) {
    for (let param in data) {
        if (param === 'body' && data.contentType.includes('application/json')) {
            document.getElementById(`${param}`).value = parseBody(data[param]);
        } else {
            document.getElementById(`${param}`).value = data[param];
        }
    }
}

function parseBody(data) {
    let parsedBody = '{\n';
    if (Array.isArray(data)) {
        data.forEach((item) => {
            parsedBody += '\t{\n';
            for (let param in item) {
                parsedBody += `\t\t"${param}"=${item[param]},\n`;
            }
            parsedBody += '\t}\n';
        })

    } else if (typeof data === 'object') {
        parsedBody += '\t{\n';
        for (let param in data) {
            parsedBody += `\t\t"${param}"=${data[param]},\n`;
        }
        parsedBody += '\t}\n';
    } else {
        parsedBody = data;
    }
    parsedBody += '}';
    return parsedBody;
}
