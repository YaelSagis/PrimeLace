import express from "express"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; 
import UserModel from "../models/user.js"

const secret="Y;Nul5Dd$Ly9uMSwH@3Mql";

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
        const newUser = new UserModel({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            address: address,
            password: password,
            userType: (email === "Y0583225545@Gmail.com" && password === "654321") ? "admin":"client"
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
        res.status(500).json(err);
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

export const updateUser = async (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, phone, email, address, password } = req.body;
    try {
        let updateU = await UserModel.findById(userId);
        if (!updateU)
            return res.status(404).json({ message: "user not found!" });

        updateU.firstName = firstName;
        updateU.lastName = lastName;
        updateU.phone = phone;
        updateU.email = email;
        updateU.address = address;
        updateU.password = password;

        await updateU.save();
        res.status(200).json("updated");
    }
    catch (err) {
        res.status(500).json(err);
    };
}

export const deleteUser = async (req, res) => {
    const userId = req.user.id;
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
        res.status(500).json("שגיאה בהוספה למועדפים", err);
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
        res.status(500).json("שגיאה בהסרה מהמועדפים", err);
    }
};

export const getMyFavorites = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await UserModel.findById(userId).populate("favorites");
        res.status(200).json(user.favorites);
    }
    catch (err) {
        res.status(500).json("שגיאה בשליפת שמלות מועדפות", err);
    }
};