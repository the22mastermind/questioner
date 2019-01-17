const express = require('express');

const router = express.Router();
const controller = require('../controllers/controller');

router.post('/', controller.createMeetup);
router.get('/', controller.viewAllMeetups);
router.get('/:id', controller.viewMeetupDetails);
router.delete('/:id', controller.deleteMeetup);
router.post('/:id/rsvps', controller.rsvpToMeetup);

module.exports = router;
