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

function deleteMeetup(req, res) {
	let { id } = req.params;
	const findMeetup = meetups.meetups.find(meetup => {
		return meetup.id == id;
	});
	if(findMeetup) {
		const newMeetups = meetups.meetups.filter(meetup => {
			return meetup !== findMeetup;
		});
		console.log("+++ ", newMeetups);
		meetups.meetups = newMeetups;
		console.log("--- ", meetups.meetups);
		res.status(200).json({
			status: 200,
			data: newMeetups
		});
	} else {
		res.status(400).json({
			status: 400,
			error: "The meetup you are trying to delete does not exist"
		});
	}
}

module.exports = {
	createMeetup,
	viewAllMeetups,
	deleteMeetup
}