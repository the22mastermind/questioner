const express = require('express');
const router = express.Router();
const models = require('../models/models')
const controller = require('../controllers/controller');


router.post("/", controller.createMeetup);
router.get("/", controller.viewAllMeetups);
router.get("/:id", controller.viewMeetupDetails);
router.delete("/:id", controller.deleteMeetup);
router.post("/:id/rsvps", controller.rsvpToMeetup);

// Routes
module.exports = router