import express from "express"
import mongoose from "mongoose"
import DressModel from "../models/dress.js"
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
    const {name, size, image, color, price, category, status}=req.body;
    try
    {
        const newDress=new DressModel(
            {
                name:name,
                size:size,
                image:image,
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
    const {name, size, image, color, price, category, status}=req.body;
    try
    {
        let updateD=await DressModel.findById(id)
        if(!updateD)
            return res.status(404).json({message:"dress not found!"})
        updateD.name=name
        updateD.size=size
        updateD.image=image
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

export const deleteDress=async(req, res)=>
{
    const id=req.params.id;
    try
    {
        await DressModel.findByIdAndDelete(id)
        res.status(200).json("deleted")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}