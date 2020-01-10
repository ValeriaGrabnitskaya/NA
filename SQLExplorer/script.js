const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require("mysql");

let connectionConfig = {
    host: 'localhost',  // на каком компьютере расположена база данных
    user: 'root',   // каким пользователем подключаемся (на учебном сервере - "root")
    password: 'Hrab-123',   // каким паролем подключаемся (на учебном сервере - "1234")
    // database: 'smart_people' // к какой базе данных подключаемся
};

const webserver = express();

const port = 7481;

webserver.use(bodyParser.json());

webserver.use(
    express.static(path.resolve(__dirname, "public"))
);

webserver.get('/main-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

webserver.get('/get-databases', (req, res) => {
    console.log('/get-databases');
    let connection = null;
    try {
        connection = mysql.createConnection(connectionConfig);
        connection.connect();
        connection.query(
            'SHOW DATABASES'
            , (error, results, fields) => {
                if (error) {
                    res.status(500).end();
                }
                else {
                    res.send(results);
                }
                connection.end();
            });
    }
    catch (error) {
        res.status(500).end();
        if (connection)
            connection.end();
    }
});

webserver.post('/use-database', (req, res) => {
    console.log('/use-database');
    let connection = null;
    try {
        connection = mysql.createConnection(connectionConfig);
        connection.connect();
        connection.query(
            `USE ${req.body.database};`
            , (error, results, fields) => {
                if (error) {
                    res.status(500).end();
                }
                else {
                    connectionConfig.database = req.body.database;
                    res.send({ database: req.body.database });
                }
                connection.end();
            });
    }
    catch (error) {
        res.status(500).end();
        if (connection)
            connection.end();
    }
});

webserver.post('/execute-sql', (req, res) => {
    console.log('/execute-sql');
    let connection = null;

    try {
        connection = mysql.createConnection(connectionConfig);
        connection.connect();
        connection.query(
            req.body.sql
            , (error, results, fields) => {
                if (error) {
                    res.status(500).send({ sqlMessage: error.sqlMessage });
                }
                else {
                    let isUpdate = /UPDATE/i.test(req.body.sql);

                    if (isUpdate) {
                        getRowCount(connection, res);
                    } else {
                        res.send({
                            results: fields && results ? results : [],
                            fields: fields && results ? fields.map(row => ({ fieldName: row.name })) : [],
                            rowCount: results ? results.length : null
                        });
                    }
                }
                connection.end();
            });
    }
    catch (error) {
        res.status(500).end();
        if (connection)
            connection.end();
    }
});

function getRowCount(connection, res) {
    console.log('getRowCount');
    try {
        connection.query(
            'SELECT ROW_COUNT();'
            , (error, results, fields) => {
                if (error) {
                    return res.send({ sqlMessage: error.sqlMessage })
                }
                else {
                    res.send({
                        rowCount: results[0]['ROW_COUNT()']
                    });
                }
            });
    }
    catch (error) {
        return null;
    }
}

webserver.listen(port, () => {
    console.log("web server running on port " + port);
});