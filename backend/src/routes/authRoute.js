import express from 'express';
import { signUp } from '../controllers/authController.js';
import { signIn } from '../controllers/authController.js';
import { signOut } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp);

router.post('/signIn', signIn);

export default router;

// Định nghĩa các route liên quan đến xác thực (authentication) ở đây
// Ví dụ: đăng nhập, đăng ký, xác thực token, v.v.