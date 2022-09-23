import express from 'express';
import { register, signin } from '../controllers/auth.js';

const router = express.Router();

//REGISTER
router.post('/register', register);

//SIGN IN
router.post('/signin', signin);

//GOOGLE AUTH
router.post('/google');

export default router;
