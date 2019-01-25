import moment from 'moment';
import validator from '../middlewares/middlewares';
import jwt from 'jsonwebtoken';
import pool from "../config/connection";
import authenticate from "../middlewares/check-auth";

exports.getAllMeetups = async function(req, res) {
	// const token = req.headers.authorization.split(' ')[1];
	// const decoded = jwt.verify(token, process.env.JWT_KEY);
	// req.userData = decoded;
	// const { adminId } = { adminId: req.userData.userId };
	// // Fetch all meetups by admin
	// const meetups = await pool.query('SELECT * FROM meetups WHERE createdby=$1 ORDER BY createdon ASC', [adminId]);
	const meetups = await pool.query('SELECT * FROM meetups ORDER BY createdon DESC');
	return res.status(200).json({
		status: 200,
		data: meetups.rows
	});
}

exports.getSingleMeetup = async function(req, res) {
	if (req.params.id == 'upcoming') {
		// Format today's date
		let { today } = { today: moment().format() };
		try {
			// Fetch upcoming meetups with date greater than today
			const meetup = await pool.query('SELECT * FROM meetups WHERE happeningon > $1', [today]);
			if (meetup.rows.length !== 0) {
				res.status(200).json({
					status: 200,
					data: meetup.rows
				});
			} else {
				res.status(404).json({
					status: 404,
					error: 'No upcoming meetup at the moment.'
				});
			}
		} catch(error) {
			return res.status(404).json({
				status: 404,
				error: error
			});
		}
	} else {
		const { id } = { id: req.params.id };
		const parsedId = parseInt(id);
		// Check if id is an integer
		if(Number.isInteger(parsedId)){
			// Find single meetup
			const meetup = await pool.query('select * from meetups where id = $1', [id]);
			if (meetup.rows.length !== 0) {
				res.status(200).json({
					status: 200,
					data: meetup.rows
				});
			} else {
				res.status(404).json({
					status: 404,
					error: 'Meetup not found.'
				});
			}
		} else {
			return res.status(400).json({
				status: 400,
				error: 'Id is not integer.'
			});
		}
	}
}

exports.createMeetup = async function(req, res, next) {
	// Form validation
	const { error } = validator.validateMeetup(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	const token = req.headers.authorization.split(' ')[1];
	const decoded = jwt.verify(token, process.env.JWT_KEY);
	req.userData = decoded;
	const {
		topic,
		location,
		happeningOn,
		tags
	} = req.body;
	const newMeetup = {
		createdOn: moment().format('LLL'),
		topic,
		location,
		happeningOn,
		tags: tags.split(', '),
		createdby: req.userData.userId
	};
	try {
		// Save newMeetup to db
		const insert = await pool.query('INSERT INTO meetups(createdOn, topic, location, happeningOn, tags, createdby) VALUES($1, $2, $3, $4, $5, $6)',
			[
				newMeetup.createdOn,
				newMeetup.topic,
				newMeetup.location,
				newMeetup.happeningOn,
				newMeetup.tags,
				newMeetup.createdby,
			]
		);
		return res.status(201).json({
			status: 201,
			data: [
				{
					topic: newMeetup.topic,
					location: newMeetup.location,
					happeningOn: newMeetup.happeningOn,
					tags: newMeetup.tags,
				}
			]
		});
	} catch (error) {
		return res.status(404).json({
			status: 404,
			error: 'Insert failed. ' + error.message
		});
	}

}

exports.updateMeetup = async function(req, res) {
	// Validation
	const { error } = validator.validateMeetup(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	const token = req.headers.authorization.split(' ')[1];
	const decoded = jwt.verify(token, process.env.JWT_KEY);
	req.userData = decoded;

	// const { id } = { id: req.params.id };
	const credentials = {
		id: req.params.id,
		adminId: req.userData.userId
	};
		const parsedId = parseInt(credentials.id);
		// Check if id is an integer
		if(Number.isInteger(parsedId)){
			// Check if meetup exist
			const meetup = await pool.query('SELECT * FROM meetups WHERE id=$1', [credentials.id]);
			if (meetup.rows.length === 0) {
				return res.status(404).json({
					status: 404,
					error: 'Meetup not found.'
				});
			} 
			const {
				topic,
				location,
				happeningOn,
				tags
			} = req.body;
			const newMeetup = {
				createdOn: moment().format('LLL'),
				topic,
				location,
				happeningOn,
				tags: tags.split(', '),
				id: parsedId
			};
			// Update meetup in db
			try {
				const update = await pool.query('UPDATE meetups SET createdon=$1, location=$2, topic=$3, happeningon=$4, tags=$5 where id=$6 returning *',
					[newMeetup.createdOn, newMeetup.location, newMeetup.topic, newMeetup.happeningOn, newMeetup.tags, newMeetup.id]);
				console.log(update);
				return res.status(200).json({
					status: 200,
					message: 'Meetup updated successfully!'
				});
			} catch(error) {
				return res.status(404).json({
					status: 404,
					error: error
				});
			}
		} else {
			return res.status(400).json({
				status: 400,
				error: 'Id is not integer.'
			});
		}
}

exports.deleteMeetup = async function(req, res) {
	const { id } = { id: req.params.id };
	const parsedId = parseInt(id);
	// Check if id is an integer
	if(Number.isInteger(parsedId)){
		// Check if meetup exist
		const meetup = await pool.query('SELECT * FROM meetups WHERE id=$1', [parsedId]);
		if (meetup.rows.length === 0) {
			return res.status(404).json({
				status: 404,
				error: 'Meetup not found.'
			});
		}
		try {
			// delete single meetup
			const del = await pool.query('DELETE FROM meetups WHERE id=$1', [parsedId]);
			return res.status(200).json({
				status: 200,
				data: 'Meetup deleted successfully.'
			});
		} catch (error) {
			return res.status(404).json({
				status: 404,
				error:"The meetup you are trying to delete does not exist."
			});
		}
	} else {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}
}
