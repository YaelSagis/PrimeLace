import express from "express"
import mongoose from "mongoose"
import {getAllRentings, getById, addRenting, updateRenting, deleteRenting} from "../controllers/rentingController.js"
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const rentingRouter=express.Router();

rentingRouter.get('/getAllRentings', verifyToken, verifyAdmin, getAllRentings);
rentingRouter.get('/getById/:id', verifyToken, getById);
rentingRouter.post('/addRenting', verifyToken, addRenting);
rentingRouter.put('/updateRenting/:id', verifyToken, updateRenting);
rentingRouter.delete('/deleteRenting/:id', verifyToken, deleteRenting);

export default rentingRouter;