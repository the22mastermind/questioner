import models from '../models/models';
import helper from '../helpers/helpers';
import validator from '../middlewares/middlewares';

// Create a meetup
function createMeetup(req, res) {
	const { error } = validator.validateMeetup(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
		return;
	}
	const id = helper.getNewId(models.meetups);
	const {
		topic,
		location,
		happeningOn,
		tags
	} = req.body;
	const newMeetup = {
		id,
		topic,
		location,
		happeningOn,
		tags: tags.split(', '),
		// tags
	};
	models.meetups.push(newMeetup);
	res.status(201).json({
		status: 201,
		data: [{
			topic: topic,
			location: location,
			happeningOn: happeningOn,
			tags: tags.split(', ')
		}]
	});
}

// View all meetups
function viewAllMeetups(req, res) {
	res.json({
		status: 200,
		data: models.meetups
	});
}

// User view specific meetup details
function viewMeetupDetails(req, res) {
	if (req.params.id == 'upcoming') {
		res.json({
 			status: 200,
 			message: 'Upcoming meetups',
 			data: models.rsvps
 		});
	} else {
		const { id } = req.params.id;
		// Find meetup
		const meetup = models.meetups.find(m => m.id === parseInt(id, 10));
		if (meetup) {
			res.status(200).json({
				status: 200,
				data: meetup
			});
		} else {
			res.status(404).json({
				status: 404,
				error: 'The meetup you are trying to view does not exist'
			});
		}
	}
}

// Update a meetup
function updateMeetup(req, res) {
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
	// Fetch meetup to update
	const meetup = models.meetups.find(m => m.id === parseInt(id, 10));
	if (!meetup) {
		res.status(404).json({
			status: 404,
			error: 'The meetup you are trying to update does not exist.'
		});
		return;
	}
	const {
		topic,
		location,
		happeningOn,
		images,
		tags
	} = req.body;
	const newMeetup = {
		id,
		topic,
		location,
		happeningOn,
		images,
		tags: tags.split(', ')
	};
	// Update meetup
	meetup.topic = topic;
	meetup.location = location;
	meetup.happeningOn = happeningOn;
	meetup.images = images;
	meetup.tags = tags;
	res.json({
		status: 200,
		data: [meetup]
	});
}

// Delete a meetup
function deleteMeetup(req, res) {
	// Fetch meetup
	const meetup = models.meetups.find(m => m.id === parseInt(req.params.id, 10));
	if (!meetup) {
		res.status(404).json({
			status: 404,
			error: 'Delete failed. Meetup not found.'
		});
		return;
	}
	const newMeetups = models.meetups.filter(m => m.id !== parseInt(req.params.id, 10));
	models.meetups = newMeetups;
	res.status(200).json({
		status: 200,
		data: newMeetups
	});
}

// User RSVP to meetup
function rsvpToMeetup(req, res) {
	// Validation
	const { error } = validator.validateRSVP(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const newRSVPId = { id: helper.getNewId(models.rsvps) };
	const { meetupId, userId, response } = req.body;
	// Find user
	const user = models.users.find(u => u.id === parseInt(userId, 10));
	// Find meetup
	const meetup = models.meetups.find(m => m.id === parseInt(meetupId, 10));
	if (!user) {
		res.status(404).json({
			status: 404,
			error: 'User not found. Please make sure you are registered and logged in.'
		});
		return;
	}
	if (!meetup) {
		res.status(404).json({
			status: 404,
			error: 'Meetup not found.'
		});
		return;
	}
	const rsvp = {
		newRSVPId,
		meetup,
		user,
		response
	};
	models.rsvps.push(rsvp);
	const savedRsvp = [{
		meetup: meetup.id,
		topic: meetup.topic,
		status: response
	}];
	res.status(201).json({
		status: 201,
		data: savedRsvp
	});
}

// Add tags to a meetup
function addTagsToMeetup(req, res) {
	// Validation
	const { error } = validator.validateTags(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
		return;
	}
	const { id } = { id: req.params.id };
	// Fetch meetup to update
	const meetup = models.meetups.find(m => m.id === parseInt(id, 10));
	if (!meetup) {
		res.status(404).json({
			status: 404,
			error: 'The meetup you are trying to update does not exist.'
		});
		return;
	}
	const {	tags } = req.body;
	const newTags = tags.split(', ');
	// Update meetup
	meetup.tags = meetup.tags.concat(newTags);
	res.json({
		status: 200,
		data: {
			meetup: meetup.id,
			topic: meetup.topic,
			tags: meetup.tags
		}
	});
}

export default {
	createMeetup,
	viewAllMeetups,
	viewMeetupDetails,
	updateMeetup,
	deleteMeetup,
	rsvpToMeetup,
	addTagsToMeetup
};
