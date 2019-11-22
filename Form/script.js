const express = require('express');

const webserver = express();

const port = 7480;

webserver.get('/form', (req, res) => {
    if (req.query.login && req.query.password) {
        res.send(
            `<h3>Ваш логин:  ${req.query.login}</h3>
             <h3>Ваш пароль:  ${req.query.password}</h3>`
        );
    } else if (req.query.login === '' || req.query.password === '') {
        res.send(
            `
            <h3 style="color: red">Не верно введён логин или пароль</h3>
            <form method=GET action="http://localhost:3050/form">
                логин: <input type=text name=login value="${req.query.login}"><br />
                
                пароль: <input type=text name=password value="${req.query.password}"><br />
                
                <input type=submit value="Войти">
            </form>`
        );
    } else {
        res.send(
            `<form method=GET action="http://localhost:3050/form">
                логин: <input type=text name=login><br />
                
                пароль: <input type=text name=password><br />
                
                <input type=submit value="Войти">
            </form>`
        );
    }
});

webserver.listen(port, () => {
    console.log("web server running on port " + port);
}); 