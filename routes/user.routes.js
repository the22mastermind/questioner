const express = require('express');

const router = express.Router();
const controller = require('../controllers/controller');

router.post('/', controller.createUser);
router.post('/login', controller.login);
router.get('/profile', controller.userProfile);
router.get('/password-reset', controller.passwordReset);

module.exports = router;
