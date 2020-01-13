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

export { setFormData, getFormData, setErrorBlock };