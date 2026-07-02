import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { addReviewThunk, getDressByIdThunk } from "../redux/slices/dressesSlice";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'
import { createRenting } from "../API/rentingsApi";

export function ProductDetails()
{
    const {dressId} = useParams();
    const dispatch = useDispatch();
    const navi = useNavigate();

    const dress = useSelector((state) => { return state.dresses.currentDress; });
    const status = useSelector((state) => { return state.dresses.dressStatus; });
    const currentUser = useSelector((state) => { return state.auth.currentUser; });

    const isAdmin = currentUser.userType === "admin";

    useEffect(() =>
    {
        if(dressId)
            dispatch(getDressByIdThunk(dressId));
    }, [dressId, dispatch]);

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    const handleAddReview = (e) =>
    {
        e.preventDefault();
        if(!comment.trim())
            return;

        const newReview =
        {
            dressId: dressId,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            rating: Number(rating),
            comment: comment
        };
        dispatch(addReviewThunk(newReview));
        setComment("");
        setRating(5);
    }

    const [rentalRange, setRentalRange] = useState([null, null]);
    const [isSavedTemp, setIsSavedTemp] = useState(false);
    const [currentRentingId, setCurrentRentingId] = useState(null);

    const isDateBlocked = ((date) =>
    {
        if(!dress || !dress.rentals)
            return false;

        const rentings = dress.rentals;
        if(!rentings || rentings.length === 0)
            return false;

         const currentTime = new Date(date).setHours(0,0,0,0);

        return rentings.some(rental =>
        {
            const start = new Date(rental.rentDate).setHours(0,0,0,0);
            const end = new Date(rental.returnDate).setHours(0,0,0,0);
           
            return currentTime >= start && currentTime <= end;
        });
    });

    const handleSaveTempDates = async () =>
    {
        if(!rentalRange[0] || !rentalRange[1])
        {
            alert("אנא בחרי טווח תאריכים מלא");
            return;
        }

        const tempRentData = 
        {
            dressId: dressId,
            price: dress.price,
            rentDate: rentalRange[0].toLocaleDateString('en-CA'),
            returnDate: rentalRange[1].toLocaleDateString('en-CA'),
            status: "pending",
            totalAmount: dress.price
        };

        try{
            const res = await createRenting(tempRentData);

            setCurrentRentingId(res.rentingId);
            setIsSavedTemp(true);
            alert(`השמלה שוריינה בהצלחה מ-${tempRentData.rentDate} עד ${tempRentData.returnDate}!`);
            alert("התאריכים נשמרו במערכת! כעת תוכלי ללחוץ על 'השכרה' למעלה.");
        } catch (err)
        {
            alert("אופס... התאריך נתפס או שיש שגיאה בתקשורת עם השרת.");
        }
    };

    const handleRenting = () =>
    {
        navi("/payment", 
        {
            state:
            {
                rentingId: currentRentingId,
                dressId: dressId,
                rentDate: rentalRange[0].toLocaleDateString('en-CA'),
                returnDate: rentalRange[1].toLocaleDateString('en-CA')
            }
        });
    };

    if(status === "loading")
        return <p>טוען את פרטי השמלה</p>
    if(status === "failed" || !dress)
        return <p>אופס... שגיאה בטעינת השמלה</p>

    return(
        <>
        <div className="product-container">
            <div className="right">
                <video src={dress.video}></video>
                <img src={dress.image} alt={dress.userName}></img>
            </div>

            <div className="left">
                <h1>{dress.name}</h1>
                <p>תיאור בד</p>
                <ul>מידות</ul>
                <p className="price">₪{dress.price}</p>
                <button>❤️</button>
                <button 
                    onClick={handleRenting}
                    disabled={!isSavedTemp}
                >
                    {isSavedTemp ? "השכרה (התקדמי לתשלום) ➔" : "שרייני תאריכים למטה כדי להשכיר"}
                </button>
                {isAdmin && 
                (
                    <p>סך הכל השכרות פעילות לשמלה זו: {dress.rentals?.length || 0}</p>
                )}
            </div>

            <div className="leftButom">          
                <h3>זמינות שמלה</h3>
                <div className="calendar">
                    <Calendar  
                        onChange={setRentalRange}
                        value={rentalRange}
                        minDate={new Date()}
                        tileDisabled={({date}) => isDateBlocked(date)}
                        tileClassName={({date}) => isDateBlocked(date)? 'blocked': null}>
                    </Calendar>
                </div>
                <button
                    onClick={handleSaveTempDates}
                    disabled={isSavedTemp}
                >השכרה</button>
            </div>

            <div className="rightButom">
                <h3>מה הכלות שלנו אומרות</h3>
                <form onSubmit={handleAddReview}>
                    <div>
                    <label>דירוג</label>
                        <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                            <option value="4">⭐⭐⭐⭐ (4)</option>
                            <option value="3">⭐⭐⭐ (3)</option>
                            <option value="2">⭐⭐ (2)</option>
                            <option value="1">⭐ (1)</option>                        
                        </select>
                    </div>
                    <textarea 
                        placeholder="כתבי לנו את חוות דעתך על השמלה..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit">שלחי תגובה</button>
                </form>
                <ul>
                    {dress.reviews?.map((r) =>
                    (
                        <li key={r._id}>
                            <p>{r.userName}</p>
                            <span>{"⭐".repeat(r.rating)}</span>
                            <p>{r.comment}</p>
                            {/* <small>{r.createdAt= new Date(r.createdAt)}</small> */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}