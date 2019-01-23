import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from '../middlewares/middlewares';
import pool from "../config/connection";
import authenticate from "../middlewares/check-auth";

exports.rsvpToMeetup=(req, res) => {
	// Form validation
	const { error } = validator.validateRSVP(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	const { id } = { id: req.params.id };
	if(Number.isInteger(parseInt(id))){
		// console.log('ID is integer...');
	} else {
		return res.status(400).json({
			status: 400,
			error: 'Id is not integer.'
		});
	}
	// Check if meetup exists
	pool.query("SELECT * FROM meetups WHERE id=$1",[req.params.id])
	.then(meetup=>{
	  	if(meetup.rows.length!==0){
	  		// console.log('Meetup found...');
	  		// Retrieve userId from token
	  		const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
	  		// Persist rsvp to db
		  	// Fetch id of last record in table
		  	pool.query("SELECT id FROM rsvps ORDER BY id DESC LIMIT 1")
		      .then(result=>{
		          if (result.rows.length === 0) {
		          	const rsvpStatus={
		          		id: 1,
				  		meetup:req.params.id,
				  		userId:req.userData.userId,
				  		response:req.body.response
				  	};
				  	pool.query("INSERT INTO rsvps(id,meetup,userid,response) VALUES($1,$2,$3,$4) returning *", 
				    	[rsvpStatus.id, rsvpStatus.meetup, rsvpStatus.userId,rsvpStatus.response])
					.then(result=>{
					  return res.status(201).json({
					  	status: 201,
					  	data:[
					  		{
					  			meetup: result.rows[0].meetup,
					  			topic: meetup.rows[0].topic,
					  			status: result.rows[0].response
					  		}
					  	]
					  });
					})
					.catch(error=>{
						return res.status(404).json({
							status: 404,
							error: error,
							message: 'Insert failed...............'
						});
					})
		          } else {
		          	// console.log('>>>>> ', result.rows[0].id);
		          	let id = result.rows[0].id + 1
		          	// console.log('New ID: ', id);
		          	const rsvpStatus={
		          		id: id,
				  		meetup:req.params.id,
				  		userId:req.userData.userId,
				  		response:req.body.response
				  	};
				  	pool.query("INSERT INTO rsvps(id,meetup,userid,response) VALUES($1,$2,$3,$4) returning *", 
				    	[rsvpStatus.id, rsvpStatus.meetup, rsvpStatus.userId,rsvpStatus.response])
					.then(result=>{
					  return res.status(201).json({
					  	status: 201,
					  	data:[
					  		{
					  			meetup: result.rows[0].meetup,
					  			topic: meetup.rows[0].topic,
					  			status: result.rows[0].response
					  		}
					  	]
					  });
					})
					.catch(error=>{
						return res.status(404).json({
							status: 404,
							error: error.detail,
							message: 'You have already made an RSVP to this meetup.'
						});
					})
		          }
		      })
		      .catch(error=>{
		      	return res.status(404).json({
					status: 404,
					error: error
				});
		      })		  	
	  	} else {
	  		return res.status(404).json({
				status: 404,
				error: 'Meetup of id: ' + req.params.id + ' not found.'
			});
	  	}
	})
	.catch(error=>{
		return res.status(404).json({
			status: 404,
			error: error
		});
	})
}
