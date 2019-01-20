import models from '../models/models';
import helper from '../helpers/helpers';
import validator from '../middlewares/middlewares';

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
	const id = helper.getNewId(models.questions);
	const {
		title,
		body,
		createdBy
	} = req.body;
	const meetupId = req.params.id;
	const createdOn = new Date().toString();
	// Find user
	const user = models.users.find(u => u.id === parseInt(createdBy, 10));
	// Find meetup
	const meetup = models.meetups.find(m => m.id === parseInt(meetupId, 10));
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
	models.questions.push(newQuestion);
	const savedQuestion = [{
		user: user.id,
		meetup: meetup.id,
		title: title,
		body: body
	}];
	res.status(201).json({
		status: 201,
		data: newQuestion
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
	const { id } = { id: req.params.id };
	// Fetch question
	const question = models.questions.find(q => q.id === parseInt(id, 10));
	if (!question) {
		res.status(404).json({
			status: 404,
			error: 'Question not found.'
		});
		return;
	}
	// Increment question's upvotes by 1
	question.upvotes += 1;
	res.json({
		status: 200,
		data: [{
			meetup: question.meetup,
			title: question.title,
			body: question.body,
			upvotes: question.upvotes,
			downvotes: question.downvotes
		}]
	});
}

// User downvote a question
function downvoteQuestion(req, res) {
	// Validation
	const { error } = validator.validateUpvoteDownvoteQuestion(req.params);
	if (error) {
		res.status(400).json({
			status: 400,
			data: error.details[0].message
		});
		return;
	}
	const { id } = { id: req.params.id };
	// Fetch question
	const question = models.questions.find(q => q.id === parseInt(id, 10));
	if (!question) {
		res.status(404).json({
			status: 404,
			error: 'Question not found.'
		});
		return;
	}
	// Update question's downvotes by 1
	question.downvotes += 1;
	// Return updated question object
	res.json({
		status: 200,
		data: [{
			meetup: question.meetup,
			title: question.title,
			body: question.body,
			upvotes: question.upvotes,
			downvotes: question.downvotes
		}]
	});
}

// User comments on question
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
	const user = models.users.find(u => u.id === parseInt(commentedBy, 10));
	// Fetch question
	const question = models.questions.find(q => q.id === parseInt(req.params.questionId, 10));
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
	const { questionId } = req.params.questionId;
	const newCommentId = helper.getNewId(models.comments);
	const commentedOn = new Date().toString();
	const newComment = {
		newCommentId,
		commentedOn,
		questionId,
		body,
		commentedBy
	};
	models.comments.push(newComment);
	res.status(201).json({
		status: 201,
		message: 'Comment submitted successfully!'
	});
}

// User comments on question
function replyToComment(req, res) {
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
	const user = models.users.find(u => u.id === parseInt(commentedBy, 10));
	// Fetch comment
	const comment = models.comments.find(c => c.id === parseInt(req.params.id, 10));
	// If not found, return 404
	if (!user) {
		res.status(404).json({
			status: 404,
			error: 'User not found.'
		});
		return;
	}
	if (!comment) {
		res.status(404).json({
			status: 404,
			error: 'Comment not found.'
		});
		return;
	}
	const { commentId } = req.params.id;
	const newReplyId = helper.getNewId(models.replies);
	const repliedOn = new Date().toString();
	const newReply = {
		newReplyId,
		repliedOn,
		commentId,
		body,
		commentedBy
	};
	models.replies.push(newReply);
	res.status(201).json({
		status: 201,
		message: 'Reply submitted successfully!'
	});
}

export default {
	askQuestion,
	upvoteQuestion,
	downvoteQuestion,
	commentOnQuestion,
	replyToComment
};
