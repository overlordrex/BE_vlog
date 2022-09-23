import express from 'express';
import {
  update,
  deleteUser,
  getUser,
  like,
  unsubscribe,
  subscribe,
  dislike,
} from '../controllers/user.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

//delete
router.delete('/:id', verifyToken, deleteUser);

//update
router.put('/:id', verifyToken, update);

//get
router.get('/find/:id', getUser);

//subscribe
router.put('/sub/:id', verifyToken, subscribe);

//unsubscribe
router.put('/unsub/:id', verifyToken, unsubscribe);

//like
router.put('/like/:videoId', verifyToken, like);

//unlike
router.put('dislike/:videoId', verifyToken, dislike);

export default router;
