const express = require('express');

const router = express.Router();
const controller = require('../controllers/controller');

router.post('/:id/questions', controller.askQuestion);
router.patch('/:meetupId/questions/:questionId/upvote', controller.upvoteQuestion);
router.patch('/:meetupId/questions/:questionId/downvote', controller.downvoteQuestion);
router.post('/:meetupId/questions/:questionId/comment', controller.commentOnQuestion);

module.exports = router;
