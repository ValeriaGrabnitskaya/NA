async function submitForm() {
    const fetchOptions = {
        method: "post",
        body: JSON.stringify(this.getFormData())
    };
    console.log(JSON.stringify(this.getFormData()))
    const response = await fetch('/saveRequestData', fetchOptions);
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