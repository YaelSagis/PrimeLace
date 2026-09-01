import express from "express"
import mongoose from "mongoose"
import {DressModel} from "../models/dress.js"
import RentingModel from "../models/renting.js";

export const getAllDresses=async(req, res)=>
{
    try
    {
        const dresses=await DressModel.find()
        res.status(200).json(dresses)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
};

export const getById=async(req, res)=>
{
    try
    {
        const id=req.params.id
        const dress=await DressModel.findById(id)
        if(!dress)
            return res.status(404).json("dress not found!");

        res.status(200).json(dress)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

export const addDress=async(req, res)=>
{
    const {name, sizes, description, images, color, price, category, status}=req.body;
    try
    {
        const newDress=new DressModel(
            {
                name:name,
                sizes:sizes,
                description:description,
                images:images,
                color:color,
                price:price,
                category:category,
                status:status
            }
        )
        await newDress.save()
        res.status(200).json("added")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}

/*   {
        "name": "דגם בוהו-שיק",
        "size": 40,
        "image": "boho_glam.jpg",
        "color": "שמנת",
        "price": 6000,
        "category": "שיפון",
        "status": "available"
    }
*/

export const updateDress=async(req, res)=>
{
    const id=req.params.id;
    const {name, sizes, description, images, color, price, category, status}=req.body;
    try
    {
        let updateD=await DressModel.findById(id)
        if(!updateD)
            return res.status(404).json({message:"dress not found!"})
        updateD.name=name
        updateD.sizes=sizes,
        updateD.description=description,
        updateD.images=images
        updateD.color=color
        updateD.price=price
        updateD.category=category
        updateD.status=status
        await updateD.save()
        res.status(200).json("updated")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}

export const deleteDress = async (req, res) => {
    const { id } = req.params;
    try {
        const dress = await DressModel.findById(id);

        if (!dress) {
            return res.status(404).json({ message: "השמלה לא נמצאה" });
        }

        if (dress.rentals && dress.rentalCount> 0) {
            return res.status(400).json({ 
                message: "לא ניתן למחוק שמלה שכבר הושכרה בעבר" 
            });
        }

        await DressModel.findByIdAndDelete(id);
        res.status(200).json("השמלה נמחקה בהצלחה");

    } catch (err) {
        res.status(500).json(err);
    }
};

export const addReview = async (req, res) => {
    
    const { dressId, userName, rating, comment } = req.body;

    try {
        const dress = await DressModel.findById(dressId);
        
        if (!dress) {
            return res.status(404).json({ message: "שמלה לא נמצאה" });
        }

        const newReview = {
            userName: userName,
            rating: Number(rating),
            comment: comment,
            createdAt: new Date()
        };

        if (!dress.reviews) {
            dress.reviews = [];
        }

        dress.reviews.push(newReview);
        await dress.save();

        res.status(200).json(newReview);
    } 
    catch (err) 
    {
        res.status(500).json({ message: "שגיאה בהוספת תגובה", error: err });
    }
};

export const getPopularDresses = async (req, res) => {
    try 
    {
        const dresses = await DressModel.find().sort({ rentalCount: -1 }).limit(3);
        res.status(200).json(dresses || []);
    } 
    catch (error) 
    {
        console.log("Error in getPopularDresses");
        res.status(500).json({ message: error.message });
    }
};