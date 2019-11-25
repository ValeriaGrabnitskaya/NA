const express = require('express');

const webserver = express();

const port = 7480;

const authentificationErrorMsg = 'Не верно введён логин или пароль';

webserver.get('/form', (req, res) => {
    if (req.query.login && req.query.password) {
        res.send(getSuccessfulPage(req.query));
    } else if (req.query.login === '' || req.query.password === '') {
        res.send(getFormHtml(req.query, authentificationErrorMsg));
    } else {
        res.send(getFormHtml());
    }
});

function getFormHtml(data = { login: '', password: '' }, errorMsg = '') {
    return `
                <h3 style="color: red">${errorMsg}</h3>
                <form method=GET action="/form">
                логин: <input type=text name=login value="${data.login}"><br />
                
                пароль: <input type=text name=password value="${data.password}"><br />
                
                <input type=submit value="Войти">
            </form>`
}

function getSuccessfulPage(data) {
    return `<h3>Ваш логин:  ${data.login}</h3>
            <h3>Ваш пароль:  ${data.password}</h3>`
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 