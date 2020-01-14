function resetPage(formName) {
    resetForm(formName);
    setErrorBlock('');
}

function resetForm(formName) {
    let searchFormElements = document.forms[formName].elements;

    for (var i = 0; i < searchFormElements.length; i++) {
        if (searchFormElements[i].name && searchFormElements[searchFormElements[i].name].value) {
            searchFormElements[searchFormElements[i].name].value = ''
        }
    }
}

async function submitForm() {
    const fetchOptions = {
        method: "post",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(getFormData("reqForm"))
    };
    const response = await fetch('/save-request-data', fetchOptions);

    if (response.ok) {
        window.location.reload();
        resetPage('reqForm');
    } else {
        let error = await response.json();
        setErrorBlock(error.message);
    }
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
    setFormData('resForm', data);
}

function setFormData(formName, response) {
    let formParams = getFormData(formName);

    let searchFormElements = document.forms[formName].elements;

    for (let resParam in response) {
        if (formParams.hasOwnProperty(resParam)) {
            if (resParam === 'resHeaders') {
                searchFormElements[resParam].value = mapResHeaders(response[resParam]);
            } else {
                searchFormElements[resParam].value = response[resParam];
            }
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

function mapResHeaders(resHeaders) {
    let str = '';
    for (let [key, value] of Object.entries(resHeaders)) {
        str += `${key}: ${value};\n\n`;
    }
    return str;
}

function setErrorBlock(message) {
    var errorsContainer = document.getElementById('errors');
    if (message) {
        errorsContainer.innerHTML = '<li style="color: red">' + message + '</li>';
    }
}
