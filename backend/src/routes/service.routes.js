import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getAllServices, getServiceById } from '../controllers/service.controller.js';

export const serviceRouter = express.Router();

serviceRouter.get('/:branchId', authMiddleware, getAllServices);
serviceRouter.get('/:branchId/:serviceId', authMiddleware, getServiceById);