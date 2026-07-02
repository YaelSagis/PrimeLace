import express from "express"
import mongoose from "mongoose";
import RentingModel from "../models/renting.js"
import PaymentModel from "../models/payment.js";

export const getAllRentings=async(req, res)=>
{
    try
    {
        const rentings=await RentingModel.find()
        res.status(200).json(rentings)
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
        const renting=await RentingModel.findById(id)
        res.status(200).json(renting)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

export const addRenting=async(req, res)=>
{
    const {dressId, price, rentDate, returnDate, status, totalAmount, numPayments, paymentMethod}=req.body;
    const userId = req.user.id;
    try
    {
        const newRenting=new RentingModel(
            {
                userId:userId,
                dressId:dressId,
                price:price,
                rentDate:rentDate,
                returnDate:returnDate,
                ActualReturnDate:null,
                status:status,
                totalAmount:totalAmount,
                payments:[]
            }
        )

        const amountPerPayment=totalAmount/numPayments;
        const paymentsIds = [];

        for(let i=0; i<numPayments; i++)
        {
            const newPayment=new PaymentModel(
            {
                rentId:newRenting.id,
                userId:userId,
                numOfPayment:i+1,
                amountPerPayment:amountPerPayment,
                paymentMethod:paymentMethod,
                status:false
            });
            const savedPayment = await newPayment.save();
            paymentsIds.push(savedPayment._id);
        }
        
        newRenting.payments = paymentsIds;
        await newRenting.save()
        res.status(200).json("added")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}

/*  {
    "rentId": "69e136b6d62e2f9c9e9caf8c",
    "userId": "69e1366ad62e2f9c9e9caf8b",
    "numOfPayment": 2,
    "amountPerPayment": 2500,
    "paymentMethod": "Cash",
    "status": true
}
*/

/*export const updateRenting=async(req, res)=>
{
    const id=req.params.id;
    const {dressId, price, rentDate, returnDate, ActualReturnDate, status, totalAmount}=req.body;
    const userId = req.user.id;
    try
    {
        let updateR=await RentingModel.findById(id)
        if(!updateR)
            return res.status(404).json({message:"renting not found!"})
        updateR.userId=userId
        updateR.dressId=dressId
        updateR.price=price
        updateR.rentDate=rentDate
        updateR.returnDate=returnDate
        updateR.ActualReturnDate=ActualReturnDate
        updateR.status=status
        updateR.totalAmount=totalAmount
        await updateR.save()
        res.status(200).json("updated")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}*/

export const updateRenting = async (req, res) => {
    const { id } = req.params;

    try {
        let updateR = await RentingModel.findById(id);
        
        if (!updateR) {
            return res.status(404).json({ message: "ההשכרה לא נמצאה." });
        }

        updateR.status = "active";
        await updateR.save();

        res.status(200).json("confirmed");
    } 
    catch (err) {
        res.status(500).json(err);
    }
};

export const deleteRenting=async(req, res)=>
{
    const id=req.params.id;
    try
    {
        await RentingModel.findByIdAndDelete(id)
        res.status(200).json("deleted")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}

import { isAvailable } from "../services/rentingService.js";

export const getAvailability = async (req, res) => {
    try {
        const { dressId, startDate, endDate } = req.body;

        if (!dressId || !startDate || !endDate) {
            return res.status(400).json("not found");
        }

        const isAvailableRes = await isAvailable(dressId, startDate, endDate);
        
        res.status(200).json({ available: isAvailableRes });
    } 
    catch (err) {
        res.status(500).json({err});
    }
};