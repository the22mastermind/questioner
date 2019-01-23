import promise from 'bluebird';
import moment from 'moment';
import helper from '../helpers/helpers';
import validator from '../middlewares/middlewares';

const options = {
	promiseLib: promise
};
const pgp = require('pg-promise')(options);
const conString = 'postgres://postgres:rastafari@localhost:5432/questioner';
const db = pgp(conString);

function getAllMeetups(req, res, next) {
	db.any('select * from meetups order by createdon desc')
		.then(function (data) {
			res.json({
				status: 200,
				data: data,
				message: 'Fetched all meetups'
			});
		})
		.catch(function (err) {
			next(err);
		});
}


export default {
	getAllMeetups
};