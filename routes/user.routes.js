import express from 'express';
import con from '../models/users';

const router = express.Router();

router.post('/signup', con.createUser);
router.post('/login', con.login);
router.put('/password-reset', con.passwordReset);

export default router;
