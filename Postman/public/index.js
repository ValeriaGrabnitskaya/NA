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
    document.getElementById('method').value = '',
    document.getElementById('url').value = '',
    document.getElementById('keyParam1').value = '',
    document.getElementById('valueParam1').value = '',
    document.getElementById('keyParam2').value = '',
    document.getElementById('valueParam2').value = '',
    document.getElementById('contentType').value = '',
    document.getElementById('keyBody1').value = '',
    document.getElementById('valueBody1').value = '',
    document.getElementById('keyBody2').value = '',
    document.getElementById('valueBody2').value = ''
}


async function submitForm() {
    const fetchOptions = {
        method: "post",
        body: JSON.stringify(this.getFormData())
    };
    console.log(JSON.stringify(this.getFormData()))
    const response = await fetch('/saveRequestData', fetchOptions);
    if(response.status = 200) {
        getRequestsList();
        resetForm();
    }
}

function getFormData() {
    return {
        methodId: document.getElementById('method').value,
        url: document.getElementById('url').value,
        keyParam1: document.getElementById('keyParam1').value,
        valueParam1: document.getElementById('valueParam1').value,
        keyParam2: document.getElementById('keyParam2').value,
        valueParam2: document.getElementById('valueParam2').value,
        contentType: document.getElementById('contentType').value,
        keyBody1: document.getElementById('keyBody1').value,
        valueBody1: document.getElementById('valueBody1').value,
        keyBody2: document.getElementById('keyBody2').value,
        valueBody2: document.getElementById('valueBody2').value
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
    console.log(requestId);
    const fetchOptions = {
        method: "post",
        body: JSON.stringify({requestId: requestId})
    };
    const response = await fetch('/run-request', fetchOptions);
}