import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const UserModel = mongoose.models.user || mongoose.model("user", 
    new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        phone:String,
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        userType: {type: String, enum: ["admin", "client"], default: "client" },
        favorites:[{type: ObjectId, ref: "dress"}]
    }
    ,{collection: "users"}
)
);

export default UserModel;