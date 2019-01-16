const express = require('express');
const urlEncoded = require('body-parser').urlencoded({ extended:false });
const bodyJson = require('body-parser').json();
const app = express();
const PORT = 3000;

app.use(urlEncoded);
app.use(bodyJson);

app.use(require('../routes/main.routes'));

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Questioner' })
});

app.listen(PORT, ()=>{
	console.log('The app is listening on port: ' + PORT);
});

module.exports = app;