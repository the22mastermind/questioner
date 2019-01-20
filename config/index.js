import express from 'express';
import router from '../routes/main.routes';

const urlEncoded = require('body-parser').urlencoded({ extended: false });
const bodyJson = require('body-parser').json();
import path from 'path';

const app = express();
const PORT = 3000;

app.use(urlEncoded);
app.use(bodyJson);

// app.use(require('../routes/main.routes'));
app.use(router);

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
