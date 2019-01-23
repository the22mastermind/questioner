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
		let today = moment().format();
		// console.log('>>>>> ', today);
		// Fetch upcoming meetups with date greater than today
		db.any('SELECT * FROM meetups WHERE happeningon > $1', today)
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
		// return;
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

function createMeetup(req, res, next) {
	// Form validation
	const { error } = validator.validateMeetup(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
		return;
	}
	const {
		topic,
		location,
		happeningOn,
		tags
	} = req.body;
	const newMeetup = {
		createdOn: new Date(),
		topic,
		location,
		happeningOn,
		tags: tags.split(', ')
	};
	// Save newMeetup to db
	db.none('insert into meetups(createdOn, topic, location, happeningOn, tags) values(${createdOn}, ${topic}, ${location}, ${happeningOn}, ${tags})', newMeetup)
		.then(function () {
			res.status(201).json({
				status: 201,
				data: [newMeetup]
			});
		})
		.catch(function (err) {
			// next(err);
			res.status(404).json({
				status: 404,
				error: err.message
			});
			return;
		});
}

function updateMeetup(req, res, next) {
	// Validation
	const { error } = validator.validateMeetup(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
		return;
	}
	const { id } = { id: req.params.id };
		const parsedId = parseInt(id);
		// Check if id is an integer
		if(Number.isInteger(parsedId)){
			const {
				topic,
				location,
				happeningOn,
				tags
			} = req.body;
			// let images = '';
			// if (req.body.images) {
			// 	// let images = req.body.images.split(', ');
			// 	let images = req.body.images;
			// }
			const newMeetup = {
				createdOn: new Date(),
				topic,
				location,
				happeningOn,
				tags: tags.split(', '),
				id: parsedId
			};
			// Update meetup in db
			db.none('update meetups set createdOn=${createdOn}, location=${location}, topic=${topic}, happeningOn=${happeningOn}, tags=${tags} where id=${id}', newMeetup)
				.then(function () {
					res.status(200).json({
						status: 200,
						data: [newMeetup]
					});
				})
				.catch(function (err) {
					// next(err);
					// console.log(err.message);
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

function deleteMeetup(req, res, next) {
	const { id } = { id: req.params.id };
	const parsedId = parseInt(id);
	// Check if id is an integer
	if(Number.isInteger(parsedId)){
		// Find single meetup
		db.result('DELETE FROM meetups WHERE id = $1', [parsedId])
			.then(function (result) {
				if(result.rowCount === 0){
					res.status(404).json({
						status: 404,
						error:"The meetup you are trying to delete does not exist."
					});
					return;
				} else {
					res.status(200).json({
						status: 200,
						data: 'Meetup deleted successfully.'
					});
					return;
				}
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

export default {
	getAllMeetups,
	getSingleMeetup,
	createMeetup,
	updateMeetup,
	deleteMeetup
};
