import jwt from 'jsonwebtoken';

module.exports = (req, res, next) => {
	try {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			next();
		} else {
			return res.status(401).json({
				status: 401,
				error: 'Authentication failed. Token is missing.'
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(401).json({
			status: 401,
			error: 'Authentication failed. ' + error.name + ': ' + error.message
		});
	}
}