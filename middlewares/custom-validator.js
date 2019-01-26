module.exports = (req, res, next) => {
	try {
		console.log(req);
		// req.firstname.focus();
		console.log('///', req.firstname.trim());
		console.log('----', req.firstname.trim().length === 0);

		if (req.username.trim().length ===0) {
			return 'Empty spaces not allowed. Please check username and try again.';
		}
		next();
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			status: 400,
			error: error
		});
	}
}