import express from 'express';
// import controller from '../controllers/meetups.controller';
import con from '../config/queries';

const router = express.Router();

router.get('/', con.getAllMeetups);
router.get('/:id', con.getSingleMeetup);
router.post('/', con.createMeetup);
router.patch('/:id', con.updateMeetup);
router.delete('/:id', con.deleteMeetup);

export default router;
