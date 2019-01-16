const express = require('express');
const router = express.Router();
const models = require('../models/models')
const controller = require('../controllers/controller');


router.post("/", controller.createUser);
router.post("/login", controller.login);
router.get("/profile", controller.userProfile);


module.exports = router