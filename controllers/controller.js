const meetups = require('../models/models');
const helper = require('../helpers/helpers');

function createMeetup(req, res) {
	const newId = { id: helper.getNewId(meetups.meetups) };
	const { topic, location, happeningOn, tags } = req.body;
	const meetup = {
		topic,
		location,
		happeningOn,
		tags
	};
	const newMeetup = { ...newId, ...meetup }
	meetups.meetups.push(newMeetup);
	return res.status(200).json({
		status: 200,
		data: meetup
	});
}

function viewAllMeetups(req, res) {
	return res.json({
		status: 200,
		data: meetups.meetups
	});
}

module.exports = {
	createMeetup,
	viewAllMeetups
}