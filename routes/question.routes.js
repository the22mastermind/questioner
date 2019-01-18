const express = require('express');

const router = express.Router();
const controller = require('../controllers/controller');

router.post('/:id/questions', controller.askQuestion);
router.patch('/:id/questions/upvote', controller.upvoteQuestion);
router.patch('/:id/questions/downvote', controller.downvoteQuestion);
router.post('/:id/questions/comment', controller.commentOnQuestion);

module.exports = router;
