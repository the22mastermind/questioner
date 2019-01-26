import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from '../middlewares/middlewares';
import checkEmptySpaces from '../middlewares/custom-validator';
import pool from "../config/connection";

exports.createUser = async function(req, res) {
	// Form validation
	const { error } = validator.validateSignUp(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	// Check for whitespaces in form
	const spaceChecker = checkEmptySpaces.checkSpaces(req.body);
	if (spaceChecker) {
		return res.status(400).json({
			status: 400,
			error: spaceChecker.error
		});
	}
	// Check if user exists
	const user = await pool.query("SELECT * FROM users WHERE email=$1 or phonenumber=$2",[req.body.email, req.body.phoneNumber]);
  	if (user.rows.length!==0) {
  		return res.status(400).json({
  			status: 400,
  			error: "Email or phone number already exist. Please use a different email and phone number."
  		});
  	}

  	// Encrypt password
  	bcrypt.hash(req.body.password.trim(), 10, (err, hash) => {
  		if (err) {
  			return res.status(500).json({
  				status: 500,
  				error: err
  			});
  		} else {
		  	const newUser = {
		  		username: req.body.username.trim(),
		  		email: req.body.email.trim(),
		  		password: hash,
		  		firstname: req.body.firstname.trim(),
		  		lastname: req.body.lastname.trim(),
		  		othername: req.body.othername ? req.body.othername: ' ',
		  		phoneNumber: req.body.phoneNumber.trim(),
		  		isAdmin: (req.body.isAdmin) ? req.body.isAdmin : false,
		  		registered: moment().format('LLL')
		  	};

		  	// Persist user data in db
		  	try {
			    pool.query("INSERT INTO users(username,email,password,firstname,lastname,othername,phonenumber,isadmin,registered) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
			    	[
				    	newUser.username,
				    	newUser.email,
				    	newUser.password,
				    	newUser.firstname,
				    	newUser.lastname,
				    	newUser.othername,
				    	newUser.phoneNumber,
				    	newUser.isAdmin,
				    	newUser.registered
			    	]);

		    	// Create token
		    	const token = jwt.sign(
	  			{
	  				email: newUser.email
	  			},
	  			process.env.JWT_KEY,
	  			{
	  				expiresIn: '4h'
	  			});
	  			//
				return res.status(201).json({
					status: 201,
					data: [
						{
							username: newUser.username,
							email: newUser.email,
							token: token
						}
					]
				});
		    } catch (error) {
		    	return res.status(404).json({
					status: 404,
					error: error
				});
		    }
		}
  	});
}

exports.passwordReset = async function(req, res) {
	// Form validation
	const { error } = validator.validatePasswordReset(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	try {
		const result = await pool.query("SELECT * FROM users WHERE email=$1",[req.body.email]);
	  	console.log(result.rows);
	  	if(result.rows.length!==0){
	  		// Encrypt password
		  	bcrypt.hash(req.body.password, 10, (err, hash) => {
		  		if (err) {
		  			return res.status(500).json({
		  				status: 500,
		  				error: err
		  			});
		  		} else {
				  	const newUser={
				  		email:req.body.email,
				  		password:hash
				  	};

				    pool.query("UPDATE users SET password=$1 WHERE email=$2",[newUser.password, newUser.email])
						.then(result=>{
						  return res.status(200).json({
						  	status: 200,
						  	data: 'Password reset successful!'
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
	    } else {
	    	return res.status(404).json({
				status: 404,
				error: 'User does not exist.'
			});
	    }
	} catch(error) {
		return res.status(404).json({
			status: 404,
			error: error,
			message: '..................'
		});
	}
}

exports.login = async function (req, res) {
	// Form validation
	const { error } = validator.validateLogin(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
	}
	try {
		const user = await pool.query("SELECT * FROM users WHERE username=$1",[req.body.username]);
	  	if (user.rows.length!==0) {
	  		// Check user password
		  	bcrypt.compare(req.body.password, user.rows[0].password, (err, result) => {
		  		if (err) {
		  			return res.status(401).json({
		  				status: 401,
		  				error: "Invalid username or password. Please try again."
		  			});
		  		} else {
		  			const token = jwt.sign(
		  			{
		  				email: user.rows[0].email,
		  				userId: user.rows[0].id,
		  			},
		  			process.env.JWT_KEY,
		  			{
		  				expiresIn: "4h"
		  			});
		  			return res.status(200).json({
						status: 200,
						message: 'Welcome, ' + user.rows[0].firstname + '! You are now logged in.',
						token: token
					});
			    }
			    return res.status(401).json({
	  				status: 401,
	  				error: "Invalid username or password. Please try again."
	  			});
		    });
	    } else {
	    	return res.status(404).json({
				status: 404,
				error: 'User does not exist.'
			});
	    }
    } catch (error) {
		return res.status(404).json({
			status: 404,
			error: error
		});
	}
}
