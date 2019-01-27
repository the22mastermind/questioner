import express from 'express';
import con from '../models/users';

const router = express.Router();

router.post('/auth/signup', con.createUser);
router.post('/auth/login', con.login);
router.get('/', con.getAllUsers);
router.put('/password-reset', con.passwordReset);

export default router;
