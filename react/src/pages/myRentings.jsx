import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyRentings } from "../API/rentingsApi";
import { format } from "date-fns";
import "../styles/myRentings.css"

export function MyRentings()
{
    const navi = useNavigate();

    const currentUser = useSelector((state) => state.auth.currentUser); 

    const [rentings, setRentings] = useState([]);
    const [status, setStatus] = useState("idle");

    useEffect(() => 
    {
        if (!currentUser)
        {
            navi("/login");
        }

        const fetchRentings = async () =>
        {
            if (!currentUser || !currentUser._id) return;
            setStatus("loading");
            try {
                const data = await getMyRentings(currentUser._id);
                const paidData = data.filter(r => r.status === "paid");
                setRentings(paidData);
                setStatus("succeeded");
            } catch (error) {
                setStatus("failed");
            }
        };

        fetchRentings();
    }, [currentUser, navi]);

    const changeFormatDate = (dateString)=>
    {
        if(!dateString)
            return;
        return format(new Date(dateString), "dd/MM/yyyy");
    }

    return (
        <div className="admin-page-container">
            <h1 className="page-title">ההשכרות שלי</h1>

            {status === "loading" || status === "idle" ? (
                <p>טוען השכרות...</p>
            ) : status === "failed" ? (
                <p>שגיאה בטעינת ההשכרות</p>
            ) : rentings.length === 0 ? (
                <p>לא נמצאו השכרות קודמות במערכת</p>
            ) : (
                <div className="rentings-grid">
                    {rentings.map((r) => (
                        <div key={r._id} className="renting-card">
                            <div className="renting-top">
                                {r.dressId?.images?.length > 0 && (
                                    <img
                                        src={r.dressId.images[0]}
                                        alt={r.dressId.name}
                                        className="renting-dress-image"
                                    />
                                )}

                                <div className="renting-main-info">
                                    <h3>הזמנה #{r._id.slice(-6)}</h3>

                                    <h2 className="renting-dress-name">
                                        {r.dressId?.name}
                                    </h2>
                                </div>

                            </div>
                            <div className="renting-details">
                                <p><span>מידה:</span> <strong>{r.size}</strong></p>
                                <p><span>מחיר השכרה:</span> ₪{r.price}</p>
                                <hr />
                                <p><span>תאריך קבלה:</span> {changeFormatDate(r.rentDate)}</p>
                                <p><span>תאריך החזרה:</span> {changeFormatDate(r.returnDate)}</p>
                                {r.ActualReturnDate && (
                                    <p className="highlight"><span>הוחזרה בפועל:</span> {changeFormatDate(r.ActualReturnDate)}</p>
                                )}
                            </div>
                            <div className="renting-footer">
                                <p>סה"כ לתשלום: <strong>₪{r.totalAmount}</strong></p>
                                <span className="status-badge">{r.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}