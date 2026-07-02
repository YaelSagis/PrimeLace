import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const PaymentModel = mongoose.models.payment || mongoose.model("payment", 
    new mongoose.Schema(
    {
        rentId: {type: ObjectId, required: true},
        userId: {type: ObjectId, required: true},
        numOfPayment: { type: Number, required: true },
        amountPerPayment: { type: Number, required: true },
        paymentMethod: { type: String, default: "Credit Card" },
        status: { type: Boolean, default: false, required: true }
    }
    ,{collection: "payments"}
)
);

export default PaymentModel;