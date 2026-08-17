import express from "express"
import { getAllDresses, getById, addDress, updateDress, deleteDress, addReview, getPopularDresses } from "../controllers/dressController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const dressRouter=express.Router();

dressRouter.get('/getAllDresses', getAllDresses);
dressRouter.get('/getById/:id', getById);
dressRouter.post('/addDress', verifyToken, verifyAdmin, addDress);
dressRouter.put('/updateDress/:id', verifyToken, verifyAdmin, updateDress);
dressRouter.delete('/deleteDress/:id', verifyToken, verifyAdmin, deleteDress);
dressRouter.post('/addReview', verifyToken, addReview)
dressRouter.get("/popular", getPopularDresses);

export default dressRouter;
