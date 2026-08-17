import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

export const ReviewSchema = new mongoose.Schema(
{
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const DressModel = mongoose.models.dress || mongoose.model("dress", 
    new mongoose.Schema(
    {
        name:String,
        description: { type: String, default: "" },
        sizes: {type: [String], default: ["XS", "S", "M", "L", "XL"]},
        images: {type: [String], required: true },
        color:String,
        price: {type: Number, required: true },
        category:{type:ObjectId, ref: 'Category'},
        status: {type:String, default:"available"},
        reviews: {type:[ReviewSchema], default:[]},
        rentalCount: { type: Number, default: 0 },
        rentals: [{size: String, rentDate: Date, returnDate: Date}]
    }
    ,{collection: "dresses"}
)
);
