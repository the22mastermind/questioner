import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import router from '../routes/main.routes';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(router);

const rootDir = '../UI';
app.use(express.static(path.join(__dirname, rootDir)));

app.listen(port);
console.log('App is running on port ', port);

export default app;
