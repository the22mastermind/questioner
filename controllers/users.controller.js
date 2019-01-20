import models from '../models/models';
import helper from '../helpers/helpers';
import validator from '../middlewares/middlewares';

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
	const id = helper.getNewId(models.users);
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
	// Check if username exists
	const user = models.users.find(u => u.username === username);
	if (!user) {
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
		models.users.push(newUser);
		res.status(201).json({
			status: 201,
			data: [newUser]
		});
	} else {
		res.status(400).json({
			status: 400,
			error: 'This username is already taken. Please try another one.'
		});
	}
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
	const {
		username,
		password
	} = req.body;
	// Find user
	const user = models.users.find(u => u.username === username && u.password === password);
	if (user) {
		res.status(201).json({
			status: 201,
			data: user
		});
	} else {
		res.status(404).json({
			status: 404,
			error: 'User not found. Invalid username or password.'
		});
	}
}

//
function userProfile(req, res) {
	const { username } = req.body;
	// Find user
	const user = models.users.find(u => u.username === username);
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
	const { error } = validator.validatePasswordReset(req.body);
	if (error) {
		res.status(400).json({
			status: 400,
			error: error.details[0].message
		});
		return;
	}
	const { username, password, confirmPassword } = req.body;
	if (password === confirmPassword) {
		// Find user
		const user = models.users.find(u => u.username === username);
		if (user) {
			// Update user password
			user.password = password;
			res.status(200).json({
				status: 200,
				data: user,
				message: 'Password reset successfully.'
			});
		} else {
			res.status(404).json({
				status: 404,
				error: 'User not found.'
			});
		}
	} else {
		res.status(404).json({
			status: 404,
			error: 'Please make sure your passwords match.'
		});
	}
}

export default {
	createUser,
	login,
	userProfile,
	passwordReset
};
