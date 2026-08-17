import mongoose from 'mongoose';

const CategoryModel =mongoose.models.category || mongoose.model("Category",
     new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, default: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=500"}
    }
    ,{collection: "categories", timestamps: true}
)
);

export default CategoryModel;