import express from 'express';
// import controller from '../controllers/meetups.controller';
import con from '../config/queries';
import rsvp from '../models/rsvps';
import authenticate from "../middlewares/check-auth";

const router = express.Router();

router.get('/', con.getAllMeetups);
router.get('/:id', con.getSingleMeetup);
router.post('/', authenticate, con.createMeetup);
router.patch('/:id', authenticate, con.updateMeetup);
router.delete('/:id', authenticate, con.deleteMeetup);
router.post('/:id/rsvps', authenticate, rsvp.rsvpToMeetup);

export default router;
