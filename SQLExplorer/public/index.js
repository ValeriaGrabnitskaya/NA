async function getDatabases() {
    const fetchOptions = {
        headers: {
            'Accept': 'application/json'
        }
    };

    const response = await fetch('/get-databases', fetchOptions);
    
    if (response.ok) {
        const data = await response.json();

        let res = `<option value="" disabled="disabled" selected="selected">Выберите базу для работы</option>`;
        data.forEach((row) => {
            res += `<option value="${row.Database}">${row.Database}</option>`;
        });
        document.getElementById('databases').innerHTML = res;
    }
    else {
        document.getElementById('databases').innerHTML = '';
    }
}

async function onSelectDatabase() {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ database: document.getElementById('databases').value })
    };

    const response = await fetch('/use-database', fetchOptions);

    if (response.ok) {
        const data = await response.json();

        addLog(`USE ${data.database};`);
    } else {
        addLog(`<p>ошибка в подключении к базе ${data.database};</p>`);
    }
}

async function execute() {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql: document.getElementById('sqlRequest').value })
    };

    const response = await fetch('/execute-sql', fetchOptions);
    const data = await response.json();

    if (response.ok) {

        // header
        if (data.fields && data.results) {
            let table = '<table>';

            let header = '<tr>';
            data.fields.forEach((row) => {
                header += `<th>${row.fieldName}</th>`;
            });
            header += '</tr>';
            table += header;

            // body
            let body = '';
            data.results.forEach((row) => {
                body += '<tr>';
                for (let [key, value] of Object.entries(row)) {
                    body += `<td>${value}</td>`;
                }
                body += '</tr>';
            });
            table += body + '</table>';

            document.getElementById('sqlResponse').innerHTML = table;
        }

        if (data.rowCount) {
            addLog(`Количество выбранных/изменённых строк: ${data.rowCount};`);
        }
    } else {
        addLog(`${data.sqlMessage}`)
    }
}

function addLog(text) {
    var lastRow = document.querySelector('div#actionOutput');
    var elem = document.createElement("p");
    var elemText = document.createTextNode(`${text}`);
    elem.appendChild(elemText);

    if (lastRow) {
        lastRow.appendChild(elem);
    } else {
        document.getElementById('actionOutput').innerHTML = `<p>${text}</p>`;
    }
}

