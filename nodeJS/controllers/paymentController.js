import express from "express"
import mongoose from "mongoose";
import PaymentModel from "../models/payment.js"
import RentingModel from "../models/renting.js";
import {DressModel} from "../models/dress.js";

export const getAllPayments=async(req, res)=>
{
    try
    {
        const payments=await PaymentModel.find()
        res.status(200).json(payments)
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
        const payment=await PaymentModel.findById(id)
        res.status(200).json(payment)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

export const addPayments = async (req, res) => 
{
    const { rentId, numPayments, totalAmount, paymentMethod } = req.body;
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) return;

    if (!numPayments || numPayments < 1 || numPayments > 4) {
        return res.status(400).json({ message: "מספר התשלומים מוגבל ל-1 עד 4"});
    }

    try 
    {
        const amountPerPayment = Math.round((totalAmount / numPayments) * 100) / 100;
        const paymentsIds = [];

        for (let i = 0; i < numPayments; i++) {
            const newPayment = new PaymentModel({
                rentId: rentId,
                userId: userId,
                numOfPayment: i + 1,
                amountPerPayment: amountPerPayment,
                paymentMethod: paymentMethod,
                status: true 
            });
            
            const savedPayment = await newPayment.save();
            paymentsIds.push(savedPayment._id);
        }

        await RentingModel.findByIdAndUpdate(rentId, {
            $set: { status: "paid" },
            $push: { payments: { $each: paymentsIds } }
        });

        const exactRenting = await RentingModel.findById(rentId);
        if (exactRenting) {
            await DressModel.findByIdAndUpdate(exactRenting.dressId,
            {
                $inc: { rentalCount: 1 }
            });
        }

        res.status(200).json("added");
    } 
    catch (err) {
        console.error("שגיאה בעיבוד התשלומים בשרת:", err);
        res.status(500).json(err);
    }
};

/*  {
    "rentId": "69e136b6d62e2f9c9e9caf8c",
    "userId": "69e1366ad62e2f9c9e9caf8b",
    "numOfPayment": 2,
    "amountPerPayment": 2500,
    "paymentMethod": "Cash",
    "status": true
}
*/

export const updatePayment=async(req, res)=>
{
    const id=req.params.id;
    const {rentId, numOfPayment, amountPerPayment, paymentMethod, status}=req.body;
    const userId = req.user._id;
    try
    {
        let updateP=await PaymentModel.findById(id)
        if(!updateP)
            return res.status(404).json({message:"payment not found!"})
        updateP.rentId=rentId
        updateP.userId=userId
        updateP.numOfPayment=numOfPayment
        updateP.amountPerPayment=amountPerPayment
        updateP.paymentMethod=paymentMethod
        updateP.status=status
        await updateP.save()
        res.status(200).json("updated")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}

export const deletePayment=async(req, res)=>
{
    const id=req.params.id;
    try
    {
        await PaymentModel.findByIdAndDelete(id)
        res.status(200).json("deleted")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}