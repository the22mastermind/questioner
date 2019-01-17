const meetups = require('../models/models');
const helper = require('../helpers/helpers');
const validator = require('../middlewares/middlewares');

// Create a meetup
function createMeetup(req, res) {
	const { error } = validator.validateMeetup(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const id = helper.getNewId(meetups.meetups);
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
		tags: tags.split(', ')
	};
	meetups.meetups.push(newMeetup);
	res.status(201).json({
		status: 201,
		data: [{
			topic: topic,
			location: location,
			happeningOn: happeningOn,
			tags: [tags]
		}]
	});
}

// View all meetups
function viewAllMeetups(req, res) {
	return res.json({
		status: 200,
		data: meetups.meetups
	});
}

// User view specific meetup details
function viewMeetupDetails(req, res) {
	const { id } = req.params;
	if (Number.isInteger(parseInt(id, 10))) {
		// Find meetup
		const meetup = meetups.meetups.find(m => m.id === parseInt(id, 10));
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
	} else {
		if (id === 'upcoming') {
			res.status(200).json({
				status: 200,
				data: meetups.meetups
			});
		} else {
			res.status(404).json({
				status: 404,
				error: 'There are no upcoming meetups.'
			});
		}
	}
}

// Delete a meetup
function deleteMeetup(req, res) {
	// Fetch meetup
	const meetup = meetups.meetups.find(m => m.id === parseInt(req.params.id, 10));
	if (!meetup) {
		res.status(404).json({
			status: 404,
			error: 'Delete failed. Meetup not found.'
		});
		return;
	}
	const newMeetups = meetups.meetups.filter(m => m.id !== parseInt(req.params.id, 10));
	meetups.meetups = newMeetups;
	res.status(200).json({
		status: 200,
		data: newMeetups
	});
}

// User sign up
function createUser(req, res) {
	const { error } = validator.validateSignUp(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const id = helper.getNewId(meetups.users);
	const {
		firstname,
		lastname,
		othername,
		email,
		phoneNumber,
		username,
		password,
		isAdmin
	} = req.body;
	const user = {
		firstname,
		lastname,
		othername,
		email,
		phoneNumber,
		username,
		password,
		registered: new Date().toString(),
		isAdmin
	};
	const newUser = {
		id,
		firstname,
		lastname,
		othername,
		email,
		phoneNumber,
		username,
		password,
		registered: new Date().toString(),
		isAdmin
	};
	meetups.users.push(newUser);
	res.status(201).json({
		status: 201,
		data: [newUser]
	});
}

// User sign in
function login(req, res) {
	const { error } = validator.validateSignIn(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const { username } = req.body;
	// Find user
	const user = meetups.users.find(u => u.username === username);
	if (user) {
		res.status(200).json({
			status: 200,
			data: user
		});
	} else {
		res.status(404).json({
			status: 404,
			error: 'User not found.'
		});
	}
}

//
function userProfile(req, res) {
	const { username } = req.body;
	// Find user
	const user = meetups.users.find(u => u.username === username);
	if (user) {
		res.status(200).json({
			status: 200,
			data: user
		});
	} else {
		res.status(404).json({
			status: 404,
			error: 'User not found.'
		});
	}
}

// User password reset
function passwordReset(req, res) {
	const { username, password, confirmPassword } = req.body;
	// Find user
	const user = meetups.users.find(u => u.username === username);
	if (password === confirmPassword) {
		if (user) {
			res.status(200).json({
				status: 200,
				data: user,
				message: 'Password reset successfully'
			});
		} else {
			res.status(404).json({
				status: 404,
				error: 'User not found'
			});
		}
	} else {
		res.status(404).json({
			status: 404,
			error: 'Make sure your passwords match'
		});
	}
}

// User ask question
function askQuestion(req, res) {
	const { error } = validator.validateQuestion(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const id = helper.getNewId(meetups.questions);
	const {
		title,
		body,
		createdBy,
		meetupId
	} = req.body;
	const createdOn = new Date().toString();
	const votes = helper.getVotes(meetups.questions);
	// Find user
	const user = meetups.users.find(u => u.id === parseInt(createdBy, 10));
	// Find meetup
	const meetup = meetups.meetups.find(m => m.id === parseInt(meetupId, 10));
	if (!user) {
		res.status(404).json({
			status: 404,
			error: 'User not found. Please make sure you"re registered and logged in.'
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
	const newQuestion = {
		id,
		createdOn,
		user: user.id,
		meetup: meetup.id,
		title,
		body,
		votes,
		upvotes: 0,
		downvotes: 0
	};
	meetups.questions.push(newQuestion);
	const savedQuestion = [{
		user: user.id,
		meetup: meetup.id,
		title: title,
		body: body
	}];
	res.status(201).json({
		status: 201,
		data: savedQuestion
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
	const newRSVPId = { id: helper.getNewId(meetups.rsvps) };
	const { meetupId, userId, response } = req.body;
	// Find user
	const user = meetups.users.find(u => u.id === parseInt(userId, 10));
	// Find meetup
	const meetup = meetups.meetups.find(m => m.id === parseInt(meetupId, 10));
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
	meetups.rsvps.push(rsvp);
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

// User upvote a question
function upvoteQuestion(req, res) {
	// Validation
	const { error } = validator.validateUpvoteDownvoteQuestion(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const { meetupId } = req.body;
	// Fetch meetup
	const meetup = meetups.meetups.find(m => m.id === parseInt(meetupId, 10));
	// Fetch question
	const question = meetups.questions.find(q => q.id === parseInt(req.params.id, 10));
	// If not found, return 404
	if (!meetup) {
		res.status(404).json({
			status: 404,
			error: 'Meetup not found.'
		});
		return;
	}
	if (!question) {
		res.status(404).json({
			status: 404,
			error: 'Question not found.'
		});
		return;
	}
	// Increment question's votes by 1
	question.votes += 1;
	// Return updated question
	res.json({
		status: 200,
		data: [{
			meetup: meetup.id,
			title: question.title,
			body: question.body,
			votes: question.votes
		}]
	});
}

// User downvote a question
function downvoteQuestion(req, res) {
	// Validation
	const { error } = validator.validateUpvoteDownvoteQuestion(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const { meetupId } = req.body;
	// Fetch meetup
	const meetup = meetups.meetups.find(m => m.id === parseInt(meetupId, 10));
	// Fetch question
	const question = meetups.questions.find(q => q.id === parseInt(req.params.id, 10));
	// If not found, return 404
	if (!meetup) {
		res.status(404).json({
			status: 404,
			error: 'Meetup not found.'
		});
		return;
	}
	if (!question) {
		res.status(404).json({
			status: 404,
			error: 'Question not found.'
		});
		return;
	}
	// Decrement question's votes by 1
	question.votes -= 1;
	// Return updated question
	res.json({
		status: 200,
		data: [{
			meetup: meetup.id,
			title: question.title,
			body: question.body,
			votes: question.votes
		}]
	});
}

function commentOnQuestion(req, res) {
	// Validation
	const { error } = validator.validateComment(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const {
		body,
		commentedBy,
		questionId
	} = req.body;
	// Fetch meetup
	const user = meetups.users.find(u => u.id === parseInt(commentedBy, 10));
	// Fetch question
	const question = meetups.questions.find(q => q.id === parseInt(questionId, 10));
	// If not found, return 404
	if (!user) {
		res.status(404).json({
			status: 404,
			error: 'User not found.'
		});
		return;
	}
	if (!question) {
		res.status(404).json({
			status: 404,
			error: 'Question not found.'
		});
		return;
	}
	const newCommentId = { id: helper.getNewId(meetups.comments) };
	const commentedOn = {
		commentedOn: new Date().toString()
	};
	const newComment = {
		newCommentId,
		commentedOn,
		questionId,
		body,
		commentedBy
	};
	meetups.comments.push(newComment);
	res.status(201).json({
		status: 201,
		message: 'Comment submitted successfully!'
	});
}


module.exports = {
	createMeetup,
	viewAllMeetups,
	deleteMeetup,
	createUser,
	login,
	userProfile,
	passwordReset,
	askQuestion,
	rsvpToMeetup,
	upvoteQuestion,
	downvoteQuestion,
	viewMeetupDetails,
	commentOnQuestion
};