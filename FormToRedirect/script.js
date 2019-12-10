const express = require('express');
const webserver = express();

const port = 7480;

const authentificationErrorMsg = 'Не верно введён логин или пароль';

webserver.use(express.urlencoded({ extended: true }));

webserver.options('/form', (req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.send("");
});

webserver.get('/main-page', (req, res) => {
    if (req.query.param1 === '' || req.query.param2 === '') {
        res.send(getFormHtml({ login: req.query.param1, password: req.query.param2 }, authentificationErrorMsg));
    } else {
        res.send(getFormHtml());
    }
});

webserver.post('/form', async (req, res) => {
    if (req.body.login && req.body.password) {
        res.redirect(`/success?param1=${req.body.login}`);
    } else if (req.body.login === '' || req.body.password === '') {
        res.redirect(`/main-page?param1=${req.body.login}&param2=${req.body.password}`);
    }
});

webserver.get('/success', (req, res) => {
    res.send(getSuccessfulPage(req.query.param1));
});

function getFormHtml(data = { login: '', password: '' }, errorMsg = '') {
    return `
                <h3 style="color: red">${errorMsg}</h3>
                <form method=POST action="/form">
                логин: <input type=text name=login value="${data.login}"><br />
                
                пароль: <input type=text name=password value="${data.password}"><br />
                
                <input type=submit value="Войти">
            </form>`
}

function getSuccessfulPage(login) {
    return `Привет, ${login}!`
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 