async function submitForm() {
    const fetchOptions = {
        method: "post",
        body: JSON.stringify(this.getFormData())
    };
    console.log(JSON.stringify(this.getFormData()))
    const response = await fetch('/saveRequestData', fetchOptions);
    const data = await response.json();
    buildRequestBlock(data);
}

function getFormData() {
    return {
        method: document.getElementById('method').value,
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
        requestBlock += `<div><div>${item.url}</div><div>${item.method}</div><div><input type="button" click="executeService(${item.id})"/></div></div>`
    })
    var requestDiv = document.getElementById('requestBlock');
    requestDiv.innerHTML = requestBlock;
}