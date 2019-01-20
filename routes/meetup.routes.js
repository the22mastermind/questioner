import express from 'express';
import controller from '../controllers/meetups.controller';

const router = express.Router();

router.post('/', controller.createMeetup);
router.get('/', controller.viewAllMeetups);
router.get('/:id', controller.viewMeetupDetails);
router.patch('/:id', controller.updateMeetup);
router.delete('/:id', controller.deleteMeetup);
router.post('/:id/rsvps', controller.rsvpToMeetup);
router.patch('/:id/tags', controller.addTagsToMeetup);

export default router;
