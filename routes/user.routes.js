import express from 'express';
import controller from '../controllers/users.controller';

const router = express.Router();

router.post('/', controller.createUser);
router.post('/login', controller.login);
router.get('/profile', controller.userProfile);
router.put('/password-reset', controller.passwordReset);

export default router;
