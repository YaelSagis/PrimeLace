import express from 'express';
import { addCategory, deleteCategory, getAllCategories, getDressesByCategory, getLatestCategory, updateCategory } from '../controllers/categoryController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const categoryRouter = express.Router();

categoryRouter.get('/getAllCategories', getAllCategories);
categoryRouter.get('/getDressesByCategory/:id', getDressesByCategory);
categoryRouter.post('/addCategory', verifyToken, addCategory);
categoryRouter.put('/updateCategory/:id', verifyToken, updateCategory);
categoryRouter.delete('/deleteCategory/:id', verifyToken, deleteCategory);
categoryRouter.get("/latest", getLatestCategory);


export default categoryRouter;