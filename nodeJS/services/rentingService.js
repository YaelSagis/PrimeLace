import RentingModel from "../models/renting.js";

export const isAvailable=async (dressId, rentDate, returnDate)=>
{
    const notAvailable=await RentingModel.findOne(
        {
            dressId:dressId,
            status:"active",
            $or:
            [
                {
                    rentDate:{$lt: new Date(rentDate)},
                    returnDate:{$gt: new Date(returnDate)}
                }
            ]
        }
    );

    return !notAvailable;
}