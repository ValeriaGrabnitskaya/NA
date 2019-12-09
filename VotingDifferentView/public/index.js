var voteId = null;

function firstPageLoad() {
    onSelectAnswer(null);
    getStatistics();
    getStatisticsXML();
    getStatisticsJSON();
    getStatisticsText();
    getVariants();
}

async function getStatistics() {
    const fetchOptions = {
        headers: {
            'Accept': 'application/json'
        }
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
    innerHTMLData('statistics', statisticsBlock);
}

async function getStatisticsXML() {
    const fetchOptions = {
        headers: {
            'Accept': 'application/xml'
        }
    };
    const response = await fetch('/stat', fetchOptions);
    const xmlStr = await response.text();
    const data=parseXml(xmlStr);
    innerHTMLData('statisticsXML', JSON.stringify(data));
}

async function getStatisticsJSON() {
    const fetchOptions = {
        headers: {
            'Accept': 'application/json'
        }
    };
    const response = await fetch('/stat', fetchOptions);
    const data = await response.json();
    innerHTMLData('statisticsJSON', JSON.stringify(data));
}

async function getStatisticsText() {
    const fetchOptions = {
        headers: {
            'Accept': 'text/plain'
        }
    };
    const response = await fetch('/stat', fetchOptions);
    const data = await response.text();
    innerHTMLData('statisticsText', data);
}

function innerHTMLData(id, data) {
    var divBlock = document.getElementById(id);
    divBlock.innerHTML = data;
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
    innerHTMLData('variants', variantsBlock);
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

function parseXml(xml, arrayTags) {
    var dom = null;
    if (window.DOMParser) {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
    }
    else
            if (window.ActiveXObject)
            {
                    dom = new ActiveXObject('Microsoft.XMLDOM');
                    dom.async = false;
                    if (!dom.loadXML(xml))
                    {
                            throw dom.parseError.reason + " " + dom.parseError.srcText;
                    }
            }
            else
            {
                    throw "cannot parse xml string!";
            }

    function isArray(o)
    {
            return Object.prototype.toString.apply(o) === '[object Array]';
    }

    function parseNode(xmlNode, result)
    {
            if (xmlNode.nodeName == "#text") {
                    var v = xmlNode.nodeValue;
                    if (v.trim()) {
                    result['#text'] = v;
                    }
                    return;
            }

            var jsonNode = {};
            var existing = result[xmlNode.nodeName];
            if(existing)
            {
                    if(!isArray(existing))
                    {
                            result[xmlNode.nodeName] = [existing, jsonNode];
                    }
                    else
                    {
                            result[xmlNode.nodeName].push(jsonNode);
                    }
            }
            else
            {
                    if(arrayTags && arrayTags.indexOf(xmlNode.nodeName) != -1)
                    {
                            result[xmlNode.nodeName] = [jsonNode];
                    }
                    else
                    {
                            result[xmlNode.nodeName] = jsonNode;
                    }
            }

            if(xmlNode.attributes)
            {
                    var length = xmlNode.attributes.length;
                    for(var i = 0; i < length; i++)
                    {
                            var attribute = xmlNode.attributes[i];
                            jsonNode[attribute.nodeName] = attribute.nodeValue;
                    }
            }

            var length = xmlNode.childNodes.length;
            for(var i = 0; i < length; i++)
            {
                    parseNode(xmlNode.childNodes[i], jsonNode);
            }
    }

    var result = {};
    for (let i = 0; i < dom.childNodes.length; i++)
    {
            parseNode(dom.childNodes[i], result);
    }

    return result;
}
