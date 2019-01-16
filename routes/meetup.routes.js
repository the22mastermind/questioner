const express = require('express');
const router = express.Router();
const models = require('../models/models')
const controller = require('../controllers/controller');


router.post("/", controller.createMeetup);
router.get("/", controller.viewAllMeetups);
router.delete("/:id", controller.deleteMeetup);

// Routes
module.exports = router