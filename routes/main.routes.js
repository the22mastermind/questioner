import express from 'express';
import meetupRoutes from './meetup.routes';
import userRoutes from './user.routes';
import questionRoutes from './question.routes';

// const router = express.Router();

// router.use('/api/v1/meetups', require('./meetup.routes'));
// router.use('/api/v1/meetups', require('./question.routes'));
// router.use('/api/v1/users', require('./user.routes'));

const router = express.Router();

router.use('/api/v1/meetups', meetupRoutes);
router.use('/api/v1/meetups', questionRoutes);
router.use('/api/v1/users/auth', userRoutes);

export default router;
