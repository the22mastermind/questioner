import express from 'express';
import router from '../routes/main.routes';

// import urlEncoded from ('body-parser').urlencoded({ extended: false });
// import bodyJson from ('body-parser').json();
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
// const PORT = 3000;
const port = process.env.PORT || 5000;

// app.use(urlEncoded);
// app.use(bodyJson);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// app.use(require('../routes/main.routes'));
app.use(router);

const rootDir = '../UI';
app.use(express.static(path.join(__dirname, rootDir)));

// Welcome route
// app.get('/', (req, res) => {
//     res.json('Welcome to Questioner');
// });

// app.listen(PORT, () => {
// console.log(`The app is listening on port: ${PORT}`);
// });
app.listen(port)
console.log('App is running on port ', port);

// module.exports = app;
export default app;
