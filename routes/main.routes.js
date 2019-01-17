const express = require('express');

const router = express.Router();
module.exports = router;

router.use('/api/v1/meetups', require('./meetup.routes'));
router.use('/api/v1/questions', require('./question.routes'));
router.use('/api/v1/users', require('./user.routes'));
