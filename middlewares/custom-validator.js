exports.checkSpaces = function (req) {
	try {
		// console.log(req);
		if (req.username.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check username and try again.'
			}
			return response;
		}
		if (req.firstname.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check firstname and try again.'
			}
			return response;
		}
		if (req.lastname.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check lastname and try again.'
			}
			return response;
		}
		if (req.email.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check email and try again.'
			}
			return response;
		}
		if (req.phoneNumber.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check phoneNumber and try again.'
			}
			return response;
		}
		if (req.password.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check password and try again.'
			}
			return response;
		}
	} catch (error) {
		// console.log(error);
		const response = {
			status: 500,
			error: error
		};
		return response;
	}
}

exports.meetupChecker = function (req) {
	try {
		const {
			topic,
			location,
			happeningOn,
			tags
		} = req;

		if (topic.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check topic and try again.'
			}
			return response;
		}
		if (location.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check location and try again.'
			}
			return response;
		}
		if (happeningOn.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check happeningOn and try again.'
			}
			return response;
		}
		if (tags.trim().length === 0) {
			const response = {
				status: 400,
				error: 'Empty spaces not allowed. Please check tags and try again.'
			}
			return response;
		}
	} catch (error) {
		const response = {
			status: 500,
			error: error
		};
		return response;
	}
}

