import express from "express"
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors"
import {connectCloudDB,connectLocalDB } from "./config/db.js"
import dressRouter from "./routers/dressRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import paymentRouter from "./routers/paymentRouter.js";
import rentingRouter from "./routers/rentingRouter.js";
import userRouter from "./routers/userRouter.js";

var app=express();

app.use(express.json());
app.use(cors());

app.use('/dresses', dressRouter);
app.use('/categories', categoryRouter);
app.use('/payments', paymentRouter);
app.use('/rentings', rentingRouter);
app.use('/users', userRouter);

connectCloudDB();
// connectLocalDB();

const PORT = process.env.PORT || 2000;
app.listen(PORT, ()=>
{
    console.log(`primelace server is running on port ${PORT}!`);
})

import RentingModel from "./models/renting.js";

setInterval(async () => {
    try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        
        const result = await RentingModel.deleteMany({
            status: "pending", 
            createdAt: { $lt: fifteenMinutesAgo }
        });
        
        if(result.deletedCount > 0) {
            console.log(`נמחקו ${result.deletedCount} שריונות פגי תוקף`);
        }
    } catch (err) {
        console.error("שגיאה בניקוי שריונות פגי תוקף:", err);
    }
}, 60000);

export default app;