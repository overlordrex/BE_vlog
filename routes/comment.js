import express from 'express';
const router = express.Router();
import {
  addComment,
  getComments,
  deleteComment,
} from '../controllers/comment.js';
import { verifyToken } from '../verifyToken.js';

router.post('/', verifyToken, addComment);
router.get('/:videoId', getComments);
router.delete('/:id', verifyToken, deleteComment);

export default router;
