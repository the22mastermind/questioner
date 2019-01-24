// 'use strict';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import validator from '../middlewares/middlewares';
import pool from "../config/connection";
import authenticate from "../middlewares/check-auth";

// exports.askQuestion=(req, res) => {
// 	// Form validation
// 	const { error } = validator.validateQuestion(req.body);
// 	if (error) {
// 		return res.status(400).json({
// 			status: 400,
// 			error: error.details[0].message
// 		});
// 	}
// 	const { id } = { id: req.params.id };
// 	if(Number.isInteger(parseInt(id))){
// 	} else {
// 		return res.status(400).json({
// 			status: 400,
// 			error: 'Id is not integer.'
// 		});
// 	}
// 	// Check if meetup exists
// 	pool.query("SELECT * FROM meetups WHERE id=$1",[req.params.id])
// 	.then(meetup=>{
// 	  	if(meetup.rows.length!==0){
// 	  		// Retrieve userId from token
// 	  		const token = req.headers.authorization.split(' ')[1];
// 			const decoded = jwt.verify(token, process.env.JWT_KEY);
// 			req.userData = decoded;
// 			const newQuestion={
//           		createdon: moment().format('LLL'),
//           		createdby:req.userData.userId,
//           		meetup:req.params.id,
// 		  		title:req.body.title,
// 		  		body:req.body.body,
// 		  		upvotes:0,
// 		  		downvotes:0
// 		  	};
// 	  		// Persist rsvp to db
// 	  		pool.query("INSERT INTO questions(createdon,createdby,meetup,title,body,upvotes,downvotes)" +
// 	  			"VALUES($1,$2,$3,$4,$5,$6,$7) returning *", 
// 		    	[
// 			    	newQuestion.createdon,
// 			    	newQuestion.createdby,
// 			    	newQuestion.meetup,
// 			    	newQuestion.title,
// 			    	newQuestion.body,
// 			    	newQuestion.upvotes,
// 			    	newQuestion.downvotes
// 		    	])
// 			.then(result=>{
// 			  return res.status(201).json({
// 			  	status: 201,
// 			  	data:[
// 			  		{
// 			  			user: req.userData.userId,
// 			  			meetup: req.params.id,
// 			  			title: req.body.title,
// 				  		body: req.body.body
// 			  		}
// 			  	]
// 			  });
// 			})
// 			.catch(error=>{
// 				return res.status(404).json({
// 					status: 404,
// 					error: error,
// 					message: 'Insert failed...............'
// 				});
// 			})
// 	  	} else {
// 	  		return res.status(404).json({
// 				status: 404,
// 				error: 'Meetup of id: ' + req.params.id + ' not found.'
// 			});
// 	  	}
// 	})
// 	.catch(error=>{
// 		return res.status(404).json({
// 			status: 404,
// 			error: error
// 		});
// 	})
// }

// exports.upvoteQuestion=(req, res) => {
// 	// Form validation
// 	const { error } = validator.validateUpvoteDownvoteQuestion(req.params);
// 	if (error) {
// 		return res.status(400).json({
// 			status: 400,
// 			error: error.details[0].message
// 		});
// 	}
// 	const { id } = { id: req.params.id };
// 	if(!Number.isInteger(parseInt(id))){
// 		return res.status(400).json({
// 			status: 400,
// 			error: 'Id is not integer.'
// 		});
// 	}
// 	// Check if meetup exists
// 	pool.query("SELECT * FROM questions WHERE id=$1",[req.params.id])
// 	.then(question=>{
// 	  	if(question.rows.length!==0){
// 			// Compute new upvote
// 			let upvoted = question.rows[0].upvotes + 1;
// 			const newVote={
//           		upvotes: upvoted,
//           		questionId: req.params.id
// 		  	};
// 	  		// Persist rsvp to db
// 	  		pool.query("UPDATE questions SET upvotes=$1 WHERE id=$2", [newVote.upvotes, newVote.questionId])
// 			.then(result=>{
// 			  return res.status(200).json({
// 			  	status: 200,
// 			  	data:[
// 			  		{
// 			  			meetup: question.rows[0].meetup,
// 			  			title: question.rows[0].title,
// 			  			body: question.rows[0].body,
// 			  			upvotes: upvoted,
// 			  			downvotes: question.rows[0].downvotes
// 			  		}
// 			  	]
// 			  });
// 			})
// 			.catch(error=>{
// 				return res.status(404).json({
// 					status: 404,
// 					error: error,
// 					message: 'Update failed...............'
// 				});
// 			})
// 	  	} else {
// 	  		return res.status(404).json({
// 				status: 404,
// 				error: 'Question of id: ' + req.params.id + ' not found.'
// 			});
// 	  	}
// 	})
// 	.catch(error=>{
// 		return res.status(404).json({
// 			status: 404,
// 			error: error
// 		});
// 	})
// }

// exports.downvoteQuestion=(req, res) => {
// 	// Form validation
// 	const { error } = validator.validateUpvoteDownvoteQuestion(req.params);
// 	if (error) {
// 		return res.status(400).json({
// 			status: 400,
// 			error: error.details[0].message
// 		});
// 	}
// 	const { id } = { id: req.params.id };
// 	if(!Number.isInteger(parseInt(id))){
// 		return res.status(400).json({
// 			status: 400,
// 			error: 'Id is not integer.'
// 		});
// 	}
// 	// Check if meetup exists
// 	pool.query("SELECT * FROM questions WHERE id=$1",[req.params.id])
// 	.then(question=>{
// 	  	if(question.rows.length!==0){
// 			// Compute new upvote
// 			const downvoted = question.rows[0].downvotes + 1;
// 			const newVote={
//           		downvotes: downvoted,
//           		questionId: req.params.id
// 		  	};
// 	  		// Persist rsvp to db
// 	  		pool.query("UPDATE questions SET downvotes=$1 WHERE id=$2", [newVote.downvotes, newVote.questionId])
// 			.then(result=>{
// 			  return res.status(200).json({
// 			  	status: 200,
// 			  	data:[
// 			  		{
// 			  			meetup: question.rows[0].meetup,
// 			  			title: question.rows[0].title,
// 			  			body: question.rows[0].body,
// 			  			upvotes: question.rows[0].upvotes,
// 			  			downvotes: downvoted
// 			  		}
// 			  	]
// 			  });
// 			})
// 			.catch(error=>{
// 				return res.status(404).json({
// 					status: 404,
// 					error: error,
// 					message: 'Update failed...............'
// 				});
// 			})
// 	  	} else {
// 	  		return res.status(404).json({
// 				status: 404,
// 				error: 'Question of id: ' + req.params.id + ' not found.'
// 			});
// 	  	}
// 	})
// 	.catch(error=>{
// 		return res.status(404).json({
// 			status: 404,
// 			error: error
// 		});
// 	})
// }

exports.commentOnQuestion = async function(req, res){
	// Form validation
	const { error } = validator.validateComment(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	// URL parameter validation
	const { id } = { id: req.params.id };
	if(!Number.isInteger(parseInt(id))){
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}
	// Check if question exists
	const question = await pool.query("SELECT * FROM questions WHERE id=$1",[req.params.id]);
	  	if(question.rows.length!==0){
	  		// Retrieve userId from token
	  		const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;

			const newComment = {
          		commentedon: moment().format('LLL'),
          		question: question.rows[0].id,
		  		body:req.body.body,
		  		commentedby:req.userData.userId,
		  	};
	  		// Persist rsvp to db
	  		try {
		  		const insert = await pool.query("INSERT INTO comments(commentedon, question, body, commentedby) VALUES($1,$2,$3,$4)", 
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
					error: error,
					message: 'Database error caught'
				});
			}
	  	} else {
	  		return res.status(404).json({
				status: 404,
				error: 'Question of id: ' + req.params.id + ' not found.'
			});
	  	}
}