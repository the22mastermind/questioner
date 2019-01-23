import express from 'express';
// import controller from '../controllers/meetups.controller';
import con from '../config/queries';

const router = express.Router();


router.get('/', con.getAllMeetups);

export default router;
