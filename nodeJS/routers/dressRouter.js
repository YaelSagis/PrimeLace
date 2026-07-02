import express from "express"
import mongoose from "mongoose"
import { getAllDresses, getById, addDress, updateDress, deleteDress } from "../controllers/dressController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const dressRouter=express.Router();

dressRouter.get('/getAllDresses', getAllDresses);
dressRouter.get('/getById/:id', getById);
dressRouter.post('/addDress', verifyToken, verifyAdmin, addDress);
dressRouter.put('/updateDress/:id', verifyToken, verifyAdmin, updateDress);
dressRouter.delete('/deleteDress/:id', verifyToken, verifyAdmin, deleteDress);

export default dressRouter;
