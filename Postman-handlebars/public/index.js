import { setFormData, getFormData, setErrorBlock } from './mappers/data-mapper.js';

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
