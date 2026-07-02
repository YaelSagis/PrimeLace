import mongoose from 'mongoose';

const CategoryModel =mongoose.models.category || mongoose.model("Category",
     new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true }
    }
    ,{collection: "categories"}
)
);

export default CategoryModel;