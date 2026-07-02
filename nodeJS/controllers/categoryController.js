import express from "express"
import mongoose from "mongoose"
import CategoryModel from "../models/category.js"
import DressModel from "../models/dress.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        return res.status(200).json(categories);
    } 
    catch (err) {
        return res.status(500).json(err);
    }
};

export const getDressesByCategory=async(req, res)=>
{
    const id = req.params.id;
    try
    {
        if(id)
        { 
            const dresses=await DressModel.find({category: id});
            res.status(200).json(dresses)
        }
    }
    catch(err)
    {
        res.status(500).json(err)
    }
};

export const addCategory = async (req, res) => {
    const { name, image } = req.body;
    try {
        const newCategory = new CategoryModel({
            name: name,
            image: image 
        });
        await newCategory.save();
        res.status(200).json(newCategory);
    } 
    catch (err) {
        return res.status(500).json(err);
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
        const updatedCategory = await CategoryModel.findById(id);
        if (!updatedCategory)
            return res.status(404).json({ message: "category not found!" });

        updatedCategory.name = name;
        updatedCategory.image = image;
        await updatedCategory.save();
        res.status(200).json("updated");
        }
    catch (err) {
        res.status(500).json(err);
    };
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await CategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json("הקטגוריה לא נמצאה");
        }
        return res.status(200).json("הקטגוריה נמחקה בהצלחה");
    }
     catch (err) {
        return res.status(500).json(err);
    }
};

