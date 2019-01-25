import express from 'express';
// import controller from '../controllers/meetups.controller';
import con from '../models/meetups';
import rsvp from '../models/rsvps';
import authenticate from "../middlewares/check-auth";

const router = express.Router();

router.get('/', con.getAllMeetups);
router.get('/:id', authenticate, con.getSingleMeetup);
router.post('/', authenticate, con.createMeetup);
router.patch('/:id', authenticate, con.updateMeetup);
router.delete('/:id', authenticate, con.deleteMeetup);
router.post('/:id/rsvps', authenticate, rsvp.rsvpToMeetup);

export default router;
