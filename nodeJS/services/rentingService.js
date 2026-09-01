import RentingModel from "../models/renting.js";
import {DressModel} from "../models/dress.js";

// סטטוסים של שריון שנחשבים "תופסים" תאריך: פנדינג (החזקה זמנית של 15 דקות
// בזמן תשלום), אקטיבי (מאושר) ומשולם. קבוע משותף כדי שבדיקת הזמינות וסנכרון
// סטטוס השמלות לא יתפצלו לשתי רשימות שעלולות להתבדר זו מזו.
export const OCCUPYING_RENTING_STATUSES = ["pending", "active", "confirmed", "paid"];

// הזמינות נבדקת לפי מידה - לכל שמלה כמה מידות, וכל מידה יש לה לוח תאריכים
// נפרד (ראו dress.rentals / RentingModel.size). מידה אחת תפוסה לא אמורה
// לחסום הזמנה של מידה אחרת של אותה שמלה.
export const isAvailable = async (dressId, size, rentDate, returnDate) =>
{
    const start = new Date(rentDate);
    const end = new Date(returnDate);

    const notAvailable = await RentingModel.findOne(
        {
            dressId: dressId,
            size: size,
            status: { $in: OCCUPYING_RENTING_STATUSES },
            rentDate: { $lt: end },
            returnDate: { $gt: start }
        }
    );

    return !notAvailable;
}

// בדיקה גסה, ברמת השמלה כולה (לא לפי מידה) - משמשת רק לדגל התצוגה הכללי
// dress.status ("זמינה"/"מושכרת") בפאנל הניהול, לא לחסימת הזמנות.
export const isDressStillOccupied = async (dressId) =>
{
    return await RentingModel.exists({
        dressId,
        status: { $in: OCCUPYING_RENTING_STATUSES },
        returnDate: { $gte: new Date() },
        ActualReturnDate: null
    });
};

// אם שמלה לא באמת תפוסה יותר (השכרה בוטלה/פגה) - משחררת אותה חזרה
// ל"זמינה". פונקציה משותפת כדי שלוגיקת ה"מתי לשחרר שמלה" תהיה במקום אחד.
export const releaseDressIfNoLongerOccupied = async (dressId) =>
{
    if (!(await isDressStillOccupied(dressId))) {
        await DressModel.findByIdAndUpdate(dressId, { status: "available" });
    }
};

export const syncRentedDressesStatus = async () =>
{
    const now = new Date();

    const occupiedDressIds = await RentingModel.distinct("dressId", {
        status: { $in: OCCUPYING_RENTING_STATUSES },
        returnDate: { $gte: now },
        ActualReturnDate: null
    });

    await DressModel.updateMany(
        { status: "rented", _id: { $nin: occupiedDressIds } },
        { status: "available" }
    );
};
