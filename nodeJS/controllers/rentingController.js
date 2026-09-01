import express from "express"
import mongoose from "mongoose";
import RentingModel from "../models/renting.js"
import PaymentModel from "../models/payment.js";
import { isAvailable, releaseDressIfNoLongerOccupied, syncRentedDressesStatus } from "../services/rentingService.js";
import {DressModel} from "../models/dress.js";

export const getAllRentings=async(req, res)=>
{
    try
    {
        // מנתיב מוגן-מנהלים בלבד - ההזדמנות המתאימה לסנכרן את סטטוס
        // "זמינה/מושכרת" של כל השמלות (תג תצוגה בפאנל הניהול), במקום
        // להריץ את זה על כל טעינת קטלוג של לקוחות.
        await syncRentedDressesStatus();

        const rentings = await RentingModel.find()
            .populate('userId', 'firstName lastName')
            .populate({
                path: 'dressId',
                select: 'name category',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            });

        res.status(200).json(rentings);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
};

export const getByUserId=async(req, res)=>
{
    try
    {
        const id=req.params.id
        const rentings=await RentingModel.find({userId: id})
        .populate("dressId", "name images price");
        res.status(200).json(rentings)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

export const addRenting = async (req, res) => 
{
    const { dressId, size, price, rentDate, returnDate, totalAmount } = req.body;
    const userId = req.user._id;

    try {
        const available = await isAvailable(dressId, size, rentDate, returnDate);
        if (!available) {
            return res.status(409).json({ message: "התאריכים שנבחרו כבר תפוסים במידה זו." });
        }

        const newRenting = new RentingModel({
            userId: userId,
            dressId: dressId,
            size: size,
            price: price,
            rentDate: rentDate,
            returnDate: returnDate,
            ActualReturnDate: null,
            status: "pending",
            totalAmount: totalAmount,
            payments: []
        });

        await newRenting.save();
        const rentingId = newRenting._id;

        await DressModel.findByIdAndUpdate(dressId,
        {
            status: "rented",
            $push: {
                rentals: {
                    _id: rentingId,
                    size: size,
                    rentDate: rentDate,
                    returnDate: returnDate
                }
            }
        });

        setTimeout(async () =>
        {
            const currentRent = await RentingModel.findById(rentingId);

            if (currentRent && currentRent.status === "pending") {

                await RentingModel.findByIdAndDelete(rentingId);

                await DressModel.findByIdAndUpdate(dressId, {
                    $pull: { rentals: { _id: rentingId } }
                });

                await releaseDressIfNoLongerOccupied(dressId);

                console.log(`השריון הזמני פג תוקף ונמחק.`);
            }
        }, 15 * 60 * 1000);

        res.status(200).json({ 
            rentingId: newRenting._id,
            message: "התאריכים שורינו ל-15 דקות"
        });

    } 
    catch (err) 
    {
        console.error("שגיאה ביצירת שריון זמני:");
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

export const updateRentingDetails = async(req, res)=>
{
    const id=req.params.id;
    const {size, rentDate, returnDate}=req.body;
    
    try
    {
        let updateR=await RentingModel.findById(id)
        if(!updateR)
            return res.status(404).json({message:"renting not found!"})
        
        if (size) updateR.size = size;
        if (rentDate) updateR.rentDate = rentDate;
        if (returnDate) updateR.returnDate = returnDate;
        await updateR.save()

        await DressModel.updateOne(
            { _id: updateR.dressId, "rentals._id": id },
            {
                $set: {
                    "rentals.$.size": updateR.size,
                    "rentals.$.rentDate": updateR.rentDate,
                    "rentals.$.returnDate": updateR.returnDate
                }
            }
        );

        res.status(200).json("updated")
    }
    catch(err)
    {
        res.status(500).json(err)
    };
}

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

export const getAvailability = async (req, res) => {
    try {
        const { dressId, size, startDate, endDate } = req.body;

        if (!dressId || !size || !startDate || !endDate) {
            return res.status(400).json("not found");
        }

        const isAvailableRes = await isAvailable(dressId, size, startDate, endDate);
        
        res.status(200).json({ available: isAvailableRes });
    } 
    catch (err) {
        res.status(500).json({err});
    }
};