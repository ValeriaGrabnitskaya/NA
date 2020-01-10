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
                    res.send({database: req.body.database});
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
                    res.status(500).end();
                }
                else {
                    let mapFields = fields.map(row => ({ fieldName: row.name }));
                    
                    res.send({
                        results: results,
                        fields: mapFields,
                        rowCount: results.length
                    });
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

webserver.listen(port, () => {
    console.log("web server running on port " + port);
});