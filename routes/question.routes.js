const express = require('express');
const router = express.Router();
const models = require('../models/models')
const controller = require('../controllers/controller');


router.post("/", controller.askQuestion);
router.patch("/:id/upvote", controller.upvoteQuestion);
router.patch("/:id/downvote", controller.downvoteQuestion);
router.post("/comment", controller.commentOnQuestion);


module.exports = router