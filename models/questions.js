import moment from 'moment';
import jwt from 'jsonwebtoken';
import validator from '../middlewares/middlewares';
import pool from '../config/connection';
import authenticate from '../middlewares/check-auth';

exports.askQuestion = async function (req, res) {
	// Form validation
	const { error } = validator.validateQuestion(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	const { id } = req.params;
	if (!Number.isInteger(parseInt(id, 10))) {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}
	// Check if meetup exists
	const meetup = await pool.query('SELECT * FROM meetups WHERE id=$1', [id]);
	if (meetup.rows.length !== 0) {
		// Retrieve userId from token
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;

		const newQuestion = {
			createdon: moment().format('LLL'),
			createdby: req.userData.userId,
			meetup: req.params.id,
			title: req.body.title,
			body: req.body.body,
			upvotes: 0,
			downvotes: 0
		};
		try {
			// Persist rsvp to db
			const insert = await pool.query('INSERT INTO questions(createdon,createdby,meetup,title,body,upvotes,downvotes)'
				+ 'VALUES($1,$2,$3,$4,$5,$6,$7) returning *',
				[
					newQuestion.createdon,
					newQuestion.createdby,
					newQuestion.meetup,
					newQuestion.title,
					newQuestion.body,
					newQuestion.upvotes,
					newQuestion.downvotes
				]);
			return res.status(201).json({
				status: 201,
				data: [
					{
						user: req.userData.userId,
						meetup: req.params.id,
						title: req.body.title,
						body: req.body.body
					}
				]
			});
		} catch (error) {
			return res.status(404).json({
				status: 404,
				error: error
			});
		}
	} else {
		return res.status(404).json({
			status: 404,
			error: `Meetup of id: ${id} not found.`
		});
	}
};

exports.upvoteQuestion = async function (req, res) {
	// Form validation
	const { error } = validator.validateUpvoteDownvoteQuestion(req.params);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}

	const { mId, qId } = req.params;
	if (!Number.isInteger(parseInt(qId, 10))) {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}

	// Check if question exists
	const question = await pool.query('SELECT * FROM questions WHERE id=$1', [qId]);
	if (question.rows.length !== 0) {
		// Verify token
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;

		// Check if user has already upvoted
		const hasvoted = await pool.query('SELECT * FROM votes WHERE userid=$1 and questionid=$2', [req.userData.userId, qId]);
		if (hasvoted.rows.length !== 0) {
			if (hasvoted.rows[0].upvoted) {
				return res.status(401).json({
					status: 401,
					message: 'You have already upvoted this question.'
				});
			}
			// User had downvoted before
			if (hasvoted.rows[0].downvoted) {
				// Compute new vote
				const downvoted = question.rows[0].downvotes - 1;
				const upvoted = question.rows[0].upvotes + 1;
				const newVote = {
					upvotes: upvoted,
					downvotes: downvoted,
					questionId: qId
				};
				try {
					// Persist vote to db
					const upvt = await pool.query('UPDATE questions SET downvotes=$1, upvotes=$2 WHERE id=$3',
						[
							newVote.downvotes,
							newVote.upvotes,
							newVote.questionId
						]);
					try {
						// Persist downvote status to db
						const voteStatus = await pool.query('UPDATE votes SET upvoted=$1, downvoted=$2 WHERE questionid=$3 and userid=$4',
							[
								true,
								false,
								newVote.questionId,
								req.userData.userId,
							]);
					} catch (error) {
						return res.status(501).json({
							status: 501,
							error: error
						});
					}
					return res.status(200).json({
						status: 200,
						data: [
							{
								meetup: question.rows[0].meetup,
								title: question.rows[0].title,
								body: question.rows[0].body,
								upvotes: upvoted,
								downvotes: downvoted
							}
						],
						message: 'Upvote successful!'
					});
				} catch (error) {
					return res.status(501).json({
						status: 501,
						error: error
					});
				}
			}
		}

		// Compute new upvote
		const upvoted = question.rows[0].upvotes + 1;
		const newVote = {
			upvotes: upvoted,
			questionId: qId
		};
		try {
			// Persist vote to db
			const upvt = await pool.query('UPDATE questions SET upvotes=$1 WHERE id=$2', [newVote.upvotes, newVote.questionId]);
			try {
				// Persist upvote status to db
				const voteStatus = await pool.query('INSERT INTO votes(questionid, userid, upvoted) VALUES($1, $2, $3)',
					[
						newVote.questionId,
						req.userData.userId,
						true
					]);
			} catch (error) {
				return res.status(501).json({
					status: 501,
					error: error
				});
			}
			return res.status(200).json({
				status: 200,
				data: [
					{
						meetup: question.rows[0].meetup,
						title: question.rows[0].title,
						body: question.rows[0].body,
						upvotes: upvoted,
						downvotes: question.rows[0].downvotes
					}
				],
				message: 'Upvote successful!'
			});
		} catch (error) {
			return res.status(501).json({
				status: 501,
				error: error
			});
		}
	} else {
		return res.status(404).json({
			status: 404,
			error: `Question of id: ${qId} not found.`
		});
	}
};

exports.downvoteQuestion = async function (req, res) {
	// Form validation
	const { error } = validator.validateUpvoteDownvoteQuestion(req.params);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}

	const { mId, qId } = req.params;
	if (!Number.isInteger(parseInt(qId, 10))) {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}

	// Check if question exists
	const question = await pool.query('SELECT * FROM questions WHERE id=$1', [qId]);
	if (question.rows.length !== 0) {
		// Verify token
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;

		// Check if user has already downvoted
		const hasvoted = await pool.query('SELECT * FROM votes WHERE userid=$1 and questionid=$2', [req.userData.userId, qId]);
		if (hasvoted.rows.length !== 0) {
			if (hasvoted.rows[0].downvoted) {
				return res.status(401).json({
					status: 401,
					message: 'You have already downvoted this question.'
				});
			}
			// User had upvoted before
			if (hasvoted.rows[0].upvoted) {
				// Compute new vote
				const downvoted = question.rows[0].downvotes + 1;
				const upvoted = question.rows[0].upvotes - 1;
				const newVote = {
					downvotes: downvoted,
					upvotes: upvoted,
					questionId: qId
				};
				try {
					// Persist vote to db
					const dwnvt = await pool.query('UPDATE questions SET downvotes=$1, upvotes=$2 WHERE id=$3',
						[
							newVote.downvotes,
							newVote.upvotes,
							newVote.questionId
						]);
					try {
						// Persist downvote status to db
						const voteStatus = await pool.query('UPDATE votes SET upvoted=$1, downvoted=$2 WHERE questionid=$3 and userid=$4',
							[
								false,
								true,
								newVote.questionId,
								req.userData.userId,
							]);
					} catch (error) {
						return res.status(501).json({
							status: 501,
							error: error
						});
					}
					return res.status(200).json({
						status: 200,
						data: [
							{
								meetup: question.rows[0].meetup,
								title: question.rows[0].title,
								body: question.rows[0].body,
								upvotes: upvoted,
								downvotes: downvoted
							}
						],
						message: 'Downvote successful!'
					});
				} catch (error) {
					return res.status(501).json({
						status: 501,
						error: error
					});
				}
			}
		}
		// Compute new vote
		const downvoted = question.rows[0].downvotes + 1;
		const newVote = {
			downvotes: downvoted,
			questionId: qId
		};
		try {
			// Persist vote to db
			const dwnvt = await pool.query('UPDATE questions SET downvotes=$1 WHERE id=$2', [newVote.downvotes, newVote.questionId]);
			try {
				// Persist downvote status to db
				const voteStatus = await pool.query('INSERT INTO votes(questionid, userid, downvoted) VALUES($1, $2, $3)',
					[
						newVote.questionId,
						req.userData.userId,
						true
					]);
			} catch (error) {
				return res.status(501).json({
					status: 501,
					error: error
				});
			}
			return res.status(200).json({
				status: 200,
				data: [
					{
						meetup: question.rows[0].meetup,
						title: question.rows[0].title,
						body: question.rows[0].body,
						upvotes: question.rows[0].upvotes,
						downvotes: downvoted
					}
				],
				message: 'Downvote successful!'
			});
		} catch (error) {
			return res.status(501).json({
				status: 501,
				error: error
			});
		}
	} else {
		return res.status(404).json({
			status: 404,
			error: `Question of id: ${qId} not found.`
		});
	}
};

exports.commentOnQuestion = async function (req, res) {
	// Form validation
	const { error } = validator.validateComment(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	const { mId, qId } = req.params;
	if (!Number.isInteger(parseInt(qId, 10))) {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}
	// Check if question exists
	const question = await pool.query('SELECT * FROM questions WHERE id=$1', [qId]);
	if (question.rows.length !== 0) {
		// Retrieve userId from token
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;

		const newComment = {
			commentedon: moment().format('LLL'),
			question: question.rows[0].id,
			body: req.body.body,
			commentedby: req.userData.userId,
		};
		// Persist rsvp to db
		try {
			const insert = await pool.query('INSERT INTO comments(commentedon, question, body, commentedby) VALUES($1,$2,$3,$4)',
				[
					newComment.commentedon,
					newComment.question,
					newComment.body,
					newComment.commentedby,
				]);
			return res.status(201).json({
				status: 201,
				data: [
					{
						user: req.userData.userId,
						question: question.rows[0].id,
						title: question.rows[0].title,
						body: req.body.body
					}
				]
			});
		} catch (error) {
			return res.status(404).json({
				status: 404,
				error: error
			});
		}
		} else {
			return res.status(404).json({
				status: 404,
				error: `Question of id: ${qId} not found.`
			});
		}
};

exports.getQuestions = async function (req, res) {
	const { id } = req.params;
	if (!Number.isInteger(parseInt(id, 10))) {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}
	// Check if meetup exists
	const meetup = await pool.query('SELECT * FROM meetups WHERE id=$1', [id]);
	if (meetup.rows.length !== 0) {
		// Fetch all users by latest
		const questions = await pool.query('SELECT id, meetup, title, body, createdon, upvotes, downvotes FROM questions WHERE meetup=$1 ORDER BY id DESC', [id]);
		if (questions.rows.length !== 0) {
			return res.status(200).json({
				message: `${questions.rows.length} questions found.`,
				status: 200,
				data: questions.rows
			});
		} else {
			return res.status(200).json({
				status: 200,
				message: 'No questions found for this meetup.'
			});
		}
	} else {
		return res.status(404).json({
			status: 404,
			error: `Meetup of id: ${id} not found.`
		});
	}
};

exports.getComments = async function (req, res) {
	const { qId } = req.params;
	if (!Number.isInteger(parseInt(qId, 10))) {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}
	// Check if meetup exists
	const question = await pool.query('SELECT * FROM questions WHERE id=$1', [qId]);
	if (question.rows.length !== 0) {
		// Fetch all comments by latest
		const comments = await pool.query('SELECT * FROM comments WHERE question=$1 ORDER BY question DESC', [qId]);
		if (comments.rows.length !== 0) {
			return res.status(200).json({
				message: `${comments.rows.length} comments found.`,
				status: 200,
				data: comments.rows
			});
		} else {
			return res.status(200).json({
				status: 200,
				message: 'No comments found for this question.'
			});
		}
	} else {
		return res.status(404).json({
			status: 404,
			error: `Question of id: ${qId} not found.`
		});
	}
};

exports.replyToComment = async function (req, res) {
	// Form validation
	const { error } = validator.validateComment(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	const { mId, qId, cId } = req.params;
	if (!Number.isInteger(parseInt(cId, 10))) {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}
	// Check if question exists
	const comment = await pool.query('SELECT * FROM comments WHERE id=$1', [cId]);
	if (comment.rows.length !== 0) {
		// Retrieve userId from token
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;
		const newReply = {
			repliedOn: moment().format('LLL'),
			comment: comment.rows[0].id,
			body: req.body.body,
			commentedby: req.userData.userId,
		};
		// Persist rsvp to db
		try {
		const insert = await pool.query('INSERT INTO replies(repliedon, comment, body, commentedby) VALUES($1,$2,$3,$4)',
			[
				newReply.repliedOn,
				newReply.comment,
				newReply.body,
				newReply.commentedby,
			]);
		return res.status(201).json({
			status: 201,
			data: [
				{
					user: req.userData.userId,
					comment: comment.rows[0].id,
					commentBody: comment.rows[0].body,
					reply: req.body.body
				}
			]
		});
		} catch (error) {
			return res.status(404).json({
				status: 404,
				error: error
			});
		}
	} else {
		return res.status(404).json({
			status: 404,
			error: `Comment of id: ${cId} not found.`
		});
	}
};
