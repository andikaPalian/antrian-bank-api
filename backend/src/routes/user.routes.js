import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { changeUserPassword, getUserProfile, updateUserProfile } from '../controllers/user.controller.js';

export const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getUserProfile);
userRouter.patch('/profile/update', authMiddleware, updateUserProfile);
userRouter.patch('/profile/change-password', authMiddleware, changeUserPassword);