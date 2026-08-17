import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const RentingModel = mongoose.models.renting || mongoose.model("renting", 
    new mongoose.Schema(
    {
        userId: {type:ObjectId, required: true, ref: 'user'},
        dressId: {type:ObjectId, required: true, ref: 'dress'},
        size: {type: String, enum: ["XS", "S", "M", "L", "XL"], required: true},
        price: {type: Number, required: true},
        rentDate: { type: Date, required: true },
        returnDate: { type: Date, required: true },
        ActualReturnDate: {type:Date, default:null},
        status: {
            type:String,
            enum: ["pending", "active", "confirmed", "paid"],
            default:"active", required: true
        },
        payments: [{type:ObjectId, ref: "payment"}],
        totalAmount: {type:Number, required: true},
        createdAt: {type: Date, default: Date.now}
    }
)
);

export default RentingModel;