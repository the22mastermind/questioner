import moment from 'moment';
import bcrypt from 'bcrypt';
import validator from '../middlewares/middlewares';
import pool from "../config/connection";

exports.createUser=(req,res)=>{
	// Form validation
	const { error } = validator.validateSignUp(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	pool.query("SELECT * FROM users WHERE username=$1",[req.body.username])
	.then(result=>{
	  	if(result.rows.length!==0){
	  		return res.status(400).json({
	  			status: 400,
	  			error: "username already exist"
	  		});
	  	}
	  	// Encrypt password
	  	bcrypt.hash(req.body.password, 10, (err, hash) => {
	  		if (err) {
	  			return res.status(500).json({
	  				status: 500,
	  				error: err
	  			});
	  		} else {
			  	const newUser={
			  		username:req.body.username,
			  		email:req.body.email,
			  		password:hash,
			  		firstname:req.body.firstname,
			  		lastname:req.body.lastname,
			  		othername:req.body.othername ? req.body.othername: ' ',
			  		phoneNumber:req.body.phoneNumber,
			  		isAdmin:(req.body.isAdmin) ? req.body.isAdmin : false,
			  		registered:moment().format('LLL')
			  	};
			    pool.query("INSERT INTO users(username,email,password,firstname,lastname,othername,phoneNumber,isAdmin,registered)"+
			    	"VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
			    	[newUser.username,newUser.email,newUser.password,newUser.firstname,
			    	newUser.lastname,newUser.othername,newUser.phoneNumber,newUser.isAdmin,newUser.registered])
			      .then(result=>{
			          return res.status(201).json({
			          	status: 201,
			          	data:result.rows
			          });
			      })
			      .catch(error=>{
			      	return res.status(404).json({
			  			status: 404,
			  			error: error
			  		});
			      })
			}
	  	});
	})
	.catch(error=>{
		return res.status(404).json({
			status: 404,
			error: error
		});
	})
}

// exports.passwordReset=(req,res)=>{
// 	// Form validation
// 	const { error } = validator.validatePasswordReset(req.body);
// 	if (error) {
// 		res.status(400).json({
// 			status: 400,
// 			error: error.details[0].message
// 		});
// 		return;
// 	}
// 	pool.query("SELECT username FROM users WHERE username=$1",[req.body.username])
// 	.then(result=>{
// 	  	if(result.rows.length!==0){
// 		  	const newUser={
// 		  		username:req.body.username,
// 		  		password:req.body.password
// 		  	};

// 		    pool.query("UPDATE users SET password=$1 WHERE username=$2",[newUser.password, newUser.username])
// 		      .then(result=>{
// 		          return res.status(200).json({
// 		          	status: 200,
// 		          	data: 'Password reset successful!'
// 		          });
// 		      })
// 		      .catch(error=>{
// 		      	return res.status(404).json({
// 		  			status: 404,
// 		  			error: error
// 		  		});
// 		      })
// 	    } else {
// 	    	return res.status(404).json({
// 				status: 404,
// 				error: 'User does not exist.'
// 			});
// 	    }
// 	})
// 	.catch(error=>{
// 		return res.status(404).json({
// 			status: 404,
// 			error: error
// 		});
// 	})
// }