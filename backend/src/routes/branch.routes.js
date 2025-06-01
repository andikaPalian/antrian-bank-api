import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getAllBranches, getBranchById } from '../controllers/branch.controller.js';

export const branchRouter = express.Router();

branchRouter.get('/', authMiddleware, getAllBranches);
branchRouter.get('/:branchId', authMiddleware, getBranchById);