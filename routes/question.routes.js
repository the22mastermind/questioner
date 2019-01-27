import express from 'express';
import controller from '../models/questions';
import authenticate from '../middlewares/check-auth';

const router = express.Router();

router.post('/:id/questions', authenticate, controller.askQuestion);
router.get('/:id/questions', authenticate, controller.getQuestions);
router.patch('/:mId/questions/:qId/upvote', authenticate, controller.upvoteQuestion);
router.patch('/:mId/questions/:qId/downvote', authenticate, controller.downvoteQuestion);
router.post('/:mId/questions/:qId/comment', authenticate, controller.commentOnQuestion);
router.get('/:mId/questions/:qId/comment', authenticate, controller.getComments);
router.post('/:mId/questions/:qId/comment/:cId/respond', authenticate, controller.replyToComment);

export default router;
