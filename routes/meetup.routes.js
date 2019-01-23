import express from 'express';
import con from '../config/queries';

const router = express.Router();

router.get('/', con.getAllMeetups);
router.get('/:id', con.getSingleMeetup);

export default router;
