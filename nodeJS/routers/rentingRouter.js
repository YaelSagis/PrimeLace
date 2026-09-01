import express from "express"
import {getAllRentings, addRenting, updateRenting, deleteRenting, getByUserId} from "../controllers/rentingController.js"
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const rentingRouter=express.Router();

rentingRouter.get('/getAllRentings', verifyToken, verifyAdmin, getAllRentings);
rentingRouter.get('/getByUserId/:id', verifyToken, getByUserId);
rentingRouter.post('/addRenting', verifyToken, addRenting);
rentingRouter.put('/updateRenting/:id', verifyToken, verifyAdmin, updateRenting);
rentingRouter.delete('/deleteRenting/:id', verifyToken, deleteRenting);

export default rentingRouter;