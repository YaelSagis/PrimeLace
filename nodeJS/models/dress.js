import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const ReviewSchema = new mongoose.Schema(
{
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const DressModel = mongoose.models.dress || mongoose.model("dress", 
    new mongoose.Schema(
    {
        name:String,
        size: {type: Number, default: 0},
        //video
        image:String,
        color:String,
        price: {type: Number, required: true },
        //description
        category:{type:ObjectId, ref: 'Category'},
        status: {type:String, default:"available"},
        reviews: {type:[ReviewSchema], default:[]},
    }
    ,{collection: "dresses"}
)
);

export default DressModel;