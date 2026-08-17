import mongoose from "mongoose";
import { cloud_mongo_URI, local_mongo_URI } from "./config.js";


const connectCloudDB=async()=>
{
    try{
        await mongoose.connect(cloud_mongo_URI)
        console.log("connect cloud db successfully!")
    }
    catch(err)
    {
        console.log("error"+err)
    };
}

const connectLocalDB=async()=>
{
    try{
        await mongoose.connect(local_mongo_URI)
        console.log("connect local db successfully!")
    }
    catch(err)
    {
        console.log("error"+err)
    };
}

export {connectCloudDB, connectLocalDB};
