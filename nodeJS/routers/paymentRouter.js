import express from "express"
import {getAllPayments, getById, updatePayment, deletePayment, addPayments} from "../controllers/paymentController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const paymentRouter=express.Router();

paymentRouter.get('/getAllPayments', verifyToken, getAllPayments);
paymentRouter.get('/getById/:id', verifyToken, getById);
paymentRouter.post('/addPayments', verifyToken, addPayments);
paymentRouter.put('/updatePayment/:id', verifyToken, updatePayment);
paymentRouter.delete('/deletePayment/:id', verifyToken, deletePayment);

export default paymentRouter;