import express from "express"
import mongoose from "mongoose";
import PaymentModel from "../models/payment.js"

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

export const addPayment=async(req, res)=>
{
    const {rentId, numOfPayment, amountPerPayment, paymentMethod, status}=req.body;
    const userId = req.user.id;
    try
    {
        const newPayment=new PaymentModel(
            {
                rentId:rentId,
                userId:userId,
                numOfPayment:numOfPayment,
                amountPerPayment:amountPerPayment,
                paymentMethod:paymentMethod,
                status:status
            }
        )
        await newPayment.save()
        
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

export const updatePayment=async(req, res)=>
{
    const id=req.params.id;
    const {rentId, numOfPayment, amountPerPayment, paymentMethod, status}=req.body;
    const userId = req.user.id;
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