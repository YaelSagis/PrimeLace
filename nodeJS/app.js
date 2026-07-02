import express from "express"
import mongoose from "mongoose";
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

//connectCloudDB();
connectLocalDB();

app.listen(2000, ()=>
{
    console.log("primelace server is running!");
})

export default app;