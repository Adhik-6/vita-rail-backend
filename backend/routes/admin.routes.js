import { Router } from 'express';
import { getAdminDashboard } from '../controllers/index.controllers.js';

const adminRouter = Router();

adminRouter.get('/dashboard-data', getAdminDashboard);

export default adminRouter;