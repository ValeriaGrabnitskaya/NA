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

function resetPage() {
    resetForm();
    setErrorBlock([]);
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
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(this.getFormData("reqForm"))
    };
    const response = await fetch('/save-request-data', fetchOptions);

    if (response.status === 422) {
        let errors = await response.json();
        setErrorBlock(errors.errors);
    }
    if (response.status === 200) {
        getRequestsList()
        resetPage();
    }
}

function setFormData(formName, response) {
    let formParams = getFormData(formName);
    
    let searchFormElements = document.forms[formName].elements;

    for (let resParam in response) {
        if (formParams.hasOwnProperty(resParam)) {
            searchFormElements[resParam].value = response[resParam];
        }
    }
}

function getFormData(formName) {
    let searchFormElements = document.forms[formName].elements;
    let params = {};

    for (var i = 0; i < searchFormElements.length; i++) {
        if (searchFormElements[i].name) {
            params = { ...params, [searchFormElements[i].name]: searchFormElements[searchFormElements[i].name].value }
        }
    }
    return params;
}

function setErrorBlock(errorsArray) {
    var errorsContainer = document.getElementById('errors');
    errorsContainer.innerHTML = '';
    var errorsList = '';

    for (var i = 0; i < errorsArray.length; i++) {
        errorsList += '<li style="color: red">' + errorsArray[i].msg + '</li>';
    }
    errorsContainer.innerHTML = errorsList;
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
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ requestId: requestId })
    };
    const response = await fetch('/run-request', fetchOptions);
    const data = await response.json();
    console.log(data)
    setDataToForm(data);
}

function setDataToForm(data) {
    setFormData('resForm', data);
    // for (let param in data) {
    //     if (param === 'body' && data.contentType.includes('application/json')) {
    //         document.getElementById(`${param}`).value = parseBody(data[param]);
    //     } else {
    //         document.getElementById(`${param}`).value = data[param];
    //     }
    // }
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
