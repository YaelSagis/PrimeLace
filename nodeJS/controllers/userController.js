import express from "express"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; 
import UserModel from "../models/user.js"
import { jwtSecret, adminEmail, adminPassword } from "../config/config.js";

const secret = jwtSecret;

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json("שגיאה בטעינת המשתמש" );
    }
};

export const logInUser = async (req, res) => {
    try {
        const {email, password}=req.body;
        const user = await UserModel.findOne({email:email});
        if(!user)
            return res.status(404).json({message: "המשתמש לא נמצא במערכת"});
        if(user.password !== password)
            return res.status(401).json({message: "הסיסמה שגויה"});

        const partialUser = user.toObject();
        delete partialUser.password; 

        const token = jwt.sign
        (
            {_id: user._id, userType: user.userType},
            secret,
            {expiresIn: "7d"}
        );

        res.status(200).json({
            user: partialUser,
            token: token
        }); 
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

export const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id).select("-password");
        if (!user)
            return res.status(404).json({ message: "user not found!" });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

export const addUser = async (req, res) => {
    const { firstName, lastName, phone, email, address, password } = req.body;
    try {
        const normalizedEmail = email ? email.toLowerCase() : "";
        const isAdmin = adminEmail && adminPassword && normalizedEmail === adminEmail.toLowerCase() && password === adminPassword;

        const newUser = new UserModel({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            address: address,
            password: password,
            userType: isAdmin ? "admin" : "client"
        });
        await newUser.save();

        const partialUser = newUser.toObject();
        delete partialUser.password; 

        const token = jwt.sign
        (
            {_id: newUser._id, userType: newUser.userType},
            secret,
            {expiresIn: "7d"}
        );

        res.status(200).json({
            user: partialUser,
            token: token
        }); 
    }
    catch (err) {
        res.status(500).json({ message: "שגיאה ברישום המשתמש", error: err.message });
    };
}

/*
{
    "firstName": "שרה",
    "lastName": "כהן",
    "phone": "050-1234567",
    "email": "sara@gmail.com",
    "address": "רחוב ר' עקיבא 5, בני ברק",
    "password": "123"
}
*/

export const updateUser = async (req, res) =>
{
    const userId = req.user._id;
    const { firstName, lastName, phone, email, address, password } = req.body;
    
    try 
    {
        let user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "המשתמש לא נמצא!" });
        }

        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (phone) {
            user.phone = phone;
        }
        if (email) {
            user.email = email;
        }
        if (address) {
            user.address = address;
        }
        if (password) {
            user.password = password;
        }

        await user.save();
        
        res.status(200).json("updated");
    }
    catch (err) {
        res.status(500).json(err);
    }
};

export const deleteUser = async (req, res) => {
    const userId = req.user._id;
    try {
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json("deleted");
    }
    catch (err) {
        res.status(500).json(err);
    };
}

export const addToFavorites = async (req, res) => {
    const {dressId}=req.body;
    const userId=req.user._id;

    try{
        await UserModel.findByIdAndUpdate(userId,
            {$addToSet: { favorites: dressId }}
        );
        res.status(200).json("השמלה הוספה למועדפים");
    }
    catch (err) {
        res.status(500).json({ message: "שגיאה בהוספה למועדפים", error: err.message });
    }
}

export const removeFromFavorites = async (req, res) => {
    const {dressId} = req.body;
    const userId = req.user._id;

    try {
        await UserModel.findByIdAndUpdate(userId,
            {$pull: { favorites: dressId }}
        );
        res.status(200).json("השמלה הוסרה מהמועדפים");
    } 
    catch (err) {
        res.status(500).json({message: "שגיאה בהסרה מהמועדפים", error: err});
    }
};

export const getMyFavorites = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await UserModel.findById(userId).populate("favorites");
        res.status(200).json(user.favorites);
    }
    catch (err) {
        res.status(500).json({message:"שגיאה בשליפת שמלות מועדפות", error: err});
    }
};