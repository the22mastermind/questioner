import express from 'express';
// import controller from '../controllers/questions.controller';
import controller from '../models/questions';
import authenticate from "../middlewares/check-auth";

const router = express.Router();

router.post('/:id/questions', authenticate, controller.askQuestion);
// router.patch('/:id/questions/upvote', controller.upvoteQuestion);
// router.patch('/:id/questions/downvote', controller.downvoteQuestion);
// router.post('/:id/questions/comment', controller.commentOnQuestion);
// router.post('/:id/questions/comment/respond', controller.replyToComment);

export default router;
