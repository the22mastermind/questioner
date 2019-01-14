const express = require('express');
const router = express.Router();
const models = require('../models/models')
const controller = require('../controllers/controller');


router.post("/:id/rsvps", controller.rsvpToMeetup);


module.exports = router