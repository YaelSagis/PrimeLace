import express from 'express';
import mongoose from "mongoose"
import { addCategory, deleteCategory, getAllCategories, getDressesByCategory, updateCategory } from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.get('/getAllCategories', getAllCategories);
categoryRouter.get('/getDressesByCategory/:id', getDressesByCategory);
categoryRouter.post('/addCategory', addCategory);
categoryRouter.put('/updateCategory/:id', updateCategory);
categoryRouter.delete('/deleteCategory/:id', deleteCategory);

export default categoryRouter;