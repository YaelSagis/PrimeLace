import express from "express"
import mongoose from "mongoose"
import {getAllPayments, getById, addPayment, updatePayment, deletePayment} from "../controllers/paymentController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const paymentRouter=express.Router();

paymentRouter.get('/getAllPayments', verifyToken, getAllPayments);
paymentRouter.get('/getById/:id', verifyToken, getById);
paymentRouter.post('/addPayment', verifyToken, addPayment);
paymentRouter.put('/updatePayment/:id', verifyToken, updatePayment);
paymentRouter.delete('/deletePayment/:id', verifyToken, deletePayment);

export default paymentRouter;