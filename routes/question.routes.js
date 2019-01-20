import express from 'express';
import controller from '../controllers/questions.controller';

const router = express.Router();

router.post('/:id/questions', controller.askQuestion);
router.patch('/:id/questions/upvote', controller.upvoteQuestion);
router.patch('/:id/questions/downvote', controller.downvoteQuestion);
router.post('/:id/questions/comment', controller.commentOnQuestion);
router.post('/:id/questions/comment/respond', controller.replyToComment);

export default router;
