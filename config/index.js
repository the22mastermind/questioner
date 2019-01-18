const express = require('express');
const urlEncoded = require('body-parser').urlencoded({ extended: false });
const bodyJson = require('body-parser').json();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(urlEncoded);
app.use(bodyJson);

app.use(require('../routes/main.routes'));

const rootDir = '../UI';
app.use(express.static(path.join(__dirname, rootDir)));

// Welcome route
app.get('/', (req, res) => {
    res.render('../UI/index.html');
});

app.listen(PORT, () => {
console.log(`The app is listening on port: ${PORT}`);
});

module.exports = app;
