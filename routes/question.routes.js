import express from 'express';
// import controller from '../controllers/questions.controller';
import controller from '../models/questions';
import authenticate from "../middlewares/check-auth";

const router = express.Router();

router.post('/:id/questions', authenticate, controller.askQuestion);
router.patch('/:mId/questions/:qId/upvote', authenticate, controller.upvoteQuestion);
router.patch('/:mId/questions/:qId/downvote', authenticate, controller.downvoteQuestion);
router.post('/:mId/questions/:qId/comment', authenticate, controller.commentOnQuestion);
// router.post('/:id/questions/comment/respond', controller.replyToComment);

export default router;
