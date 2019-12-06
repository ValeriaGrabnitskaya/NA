var voteId = null;

function firstPageLoad() {
    onSelectAnswer(null);
    getStatistics();
    getVariants();
}

async function getStatistics() {
    const fetchOptions = {
        method: "get"
    };
    const response = await fetch('/stat', fetchOptions);
    const data = await response.json();
    createStatisticsBlock(data);
}

function createStatisticsBlock(response) {
    let statisticsBlock = '';
    response.data.forEach((item, index) => {
        statisticsBlock += `<tr><td>${item.id}</td><td>${item.value}</td></tr>`
    })
    var statisticsDiv = document.getElementById('statistics');
    statisticsDiv.innerHTML = statisticsBlock;
}

async function getVariants() {
    const fetchOptions = {
        method: "get"
    };
    const response = await fetch('/variants', fetchOptions);
    const data = await response.json();
    createVariantsBlock(data);
}

function createVariantsBlock(response) {
    let variantsBlock = '';
    response.data.forEach((item, index) => {
        variantsBlock += `<input type="radio" value="${item.id}" onclick="onSelectAnswer(${item.id})"/>
                            <label>${item.id}</label>`
    })
    var variantsDiv = document.getElementById('variants');
    variantsDiv.innerHTML = variantsBlock;
}

async function sendVote() {
    const fetchOptions = {
        method: "post",
        headers: {
            'Content-Type': 'text/plain'
        },
        body: this.voteId
    };
    const response = await fetch('/vote', fetchOptions);
    if (response.ok) {
        firstPageLoad();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

function onSelectAnswer(voteId) {
    this.voteId = voteId;
}

async function getStatisticsXML() {
    const fetchOptions = {
        method: "get",
        headers: {
            'Accept': 'application/xml'
        }
    };
    const response = await fetch('/statXML', fetchOptions);
}