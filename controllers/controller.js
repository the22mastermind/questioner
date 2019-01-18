const meetups = require('../models/models');
const helper = require('../helpers/helpers');
const validator = require('../middlewares/middlewares');

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
			error: error.details[0].message
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
		res.status(201).json({
			status: 201,
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

// User post question
function askQuestion(req, res) {
	const { error } = validator.validateQuestion(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
		return;
	}
	const id = helper.getNewId(meetups.questions);
	const {
		title,
		body,
		createdBy
	} = req.body;
	const meetupId = req.params.id;
	const createdOn = new Date().toString();
	// Find user
	const user = meetups.users.find(u => u.id === parseInt(createdBy, 10));
	// Find meetup
	const meetup = meetups.meetups.find(m => m.id === parseInt(meetupId, 10));
	if (!user) {
		res.status(404).json({
			status: 404,
			error: 'User not found. Please make sure you are registered.'
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
		meetup: parseInt(meetupId, 10),
		title,
		body,
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
	const { error } = validator.validateUpvoteDownvoteQuestion(req.params);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
		return;
	}
	let meetupId = req.params.meetupId;
	let questionId = req.params.questionId;
	// Fetch meetup
	let meetup = meetups.meetups.find(m => m.id === parseInt(meetupId, 10));
	// Fetch question
	let question = meetups.questions.find(q => q.id === parseInt(questionId, 10));
	// If not found, return 404
	if (!meetup) {
		res.status(404).json({
			status: 404,
			error: 'Meetup not found???'
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
	let index = meetups.questions.findIndex(q => q.id === parseInt(questionId, 10));
	// console.log('>>> ', meetups.questions[index].upvotes);
	let newVotes = helper.upVote(meetups.questions[index].upvotes);
	
	// console.log('INDEX: ', index);
	// console.log('DATA: ', meetups.questions[index]);
	meetups.questions[index] = {
		id: meetups.questions[index].id,
		createdOn: meetups.questions[index].createdOn,
		user: meetups.questions[index].user,
		meetup: meetups.questions[index].meetup,
		title: meetups.questions[index].title,
		body: meetups.questions[index].body,
		upvotes: newVotes,
		downvotes: meetups.questions[index].downvotes
	};
	// console.log("*********************");
	// console.log(meetups.questions);
	// const uodatedQuestion = meetups.questions.find(q => q.id === parseInt(questionId, 10));
	// Return updated question
	res.json({
		status: 200,
		data: [{
			meetup: meetupId,
			title: question.title,
			body: question.body,
			votes: newVotes
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
	let meetupId = req.params.meetupId;
	let questionId = req.params.questionId;
	// Fetch meetup
	const meetup = meetups.meetups.find(m => m.id === parseInt(meetupId, 10));
	// Fetch question
	const question = meetups.questions.find(q => q.id === parseInt(questionId, 10));
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
	question.downvotes -= 1;
	// Return updated question
	res.json({
		status: 200,
		data: [{
			meetup: meetup.id,
			title: question.title,
			body: question.body,
			votes: question.downvotes
		}]
	});
}

function commentOnQuestion(req, res) {
	// Validation
	const { error } = validator.validateComment(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
		return;
	}
	const {
		body,
		commentedBy
	} = req.body;
	// Fetch meetup
	const user = meetups.users.find(u => u.id === parseInt(commentedBy, 10));
	// Fetch question
	const question = meetups.questions.find(q => q.id === parseInt(req.params.questionId, 10));
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
	const questionId = req.params.questionId;
	const newCommentId = helper.getNewId(meetups.comments);
	const commentedOn = new Date().toString();
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
