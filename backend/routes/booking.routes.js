import express from 'express';
import { processOrder, bookOrder, sendSms } from '../controllers/index.controllers.js';
import { verifyToken } from '../middlewares/index.middlewares.js';

const bookingRouter = express.Router();

bookingRouter.post('/process-order', verifyToken, processOrder);
bookingRouter.post('/book-order', verifyToken, bookOrder);
bookingRouter.post('/send-sms', verifyToken, sendSms);

export default bookingRouter;
