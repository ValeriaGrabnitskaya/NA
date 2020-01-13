const express = require('express');
const path = require('path');

const webserver = express();

const port = 7481;

webserver.use(
    express.static(path.resolve(__dirname, "public"))
);

// webserver.get('/main-page', (req, res) => {
//     res.sendFile(path.join(__dirname + '/client/public/index.html'));
// });

webserver.listen(port, () => {
    console.log("web server running on port " + port)
});