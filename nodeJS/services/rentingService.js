import RentingModel from "../models/renting.js";

export const isAvailable=async (dressId, rentDate, returnDate)=>
{
    const start = new Date(rentDate);
    const end = new Date(returnDate);

    const notAvailable=await RentingModel.findOne(
        {
            dressId: dressId,
            status: { $in: ["active", "confirmed"] },
            rentDate: { $lt: end },
            returnDate: { $gt: start }
        }
    );

    return !notAvailable;
}