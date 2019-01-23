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

function getSingleMeetup(req, res, next) {
	if (req.params.id == 'upcoming') {
		// Format today's date
		let today = moment().format
		// Fetch upcoming meetups with date greater than today
		db.one('SELECT * FROM meetups WHERE happeningOn > ${today} ORDER BY happeningOn ASC')
			.then(function (data) {
				// console.log(data);
				res.status(200).json({
					status: 200,
					data: data
				});
			})
			.catch(function (err) {
				// If not found, return not found message
				// next(err);
				res.status(404).json({
					status: 404,
					error: err.message
				});
				return;
			});
		// res.status(404).json({
		// 	status: 404,
		// 	error: '>>>> upcoming needs implementation here.'
		// });
		return;
	} else {
		const { id } = { id: req.params.id };
		const parsedId = parseInt(id);
		// console.log('Id: ', parsedId);
		// console.log('Type: ', typeof parsedId);
		// Check if id is an integer
		if(Number.isInteger(parsedId)){
			// Find single meetup
			db.one('select * from meetups where id = $1', parsedId)
				.then(function (data) {
					// console.log(data);
					res.status(200).json({
						status: 200,
						data: data
					});
				})
				.catch(function (err) {
					// If not found, return not found message
					// next(err);
					res.status(404).json({
						status: 404,
						error: err.message
					});
					return;
				});
		} else {
			res.status(400).json({
				status: 400,
				error: 'Id is not integer.'
			});
			return;
		}
	}
}

export default {
	getAllMeetups,
	getSingleMeetup
};
