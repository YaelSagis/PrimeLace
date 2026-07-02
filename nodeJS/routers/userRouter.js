import express from "express"
import mongoose from "mongoose"
import { getMe, logInUser, getAllUsers, getById, addUser, updateUser, deleteUser, addToFavorites, removeFromFavorites, getMyFavorites } from "../controllers/userController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const userRouter=express.Router();

userRouter.get("/getMe", verifyToken, getMe);
userRouter.post('/logInUser', logInUser);
userRouter.get('/getAllUsers', verifyToken, verifyAdmin, getAllUsers);
userRouter.get('/getById/:id', verifyToken, verifyAdmin, getById);
userRouter.post('/addUser', addUser);
userRouter.put('/updateUser/:id', verifyToken, updateUser);
userRouter.delete('/deleteUser/:id', verifyToken, verifyAdmin, deleteUser);
userRouter.post("/addToFavorites", verifyToken, addToFavorites);
userRouter.post("/removeFromFavorites", verifyToken, removeFromFavorites);
userRouter.get("/getMyFavorites", verifyToken, getMyFavorites);

export default userRouter;