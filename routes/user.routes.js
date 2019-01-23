import express from 'express';
import con from '../models/users';

const router = express.Router();

router.post('/', con.createUser);
router.put('/password-reset', con.passwordReset);

export default router;
