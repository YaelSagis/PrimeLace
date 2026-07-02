import { useLocation, useNavigate } from "react-router-dom"

export function OrderSuccess()
{
    const location = useLocation();
    const navi = useNavigate();
    const {rentingId, rentDate, returnDate} = location.state || {};

    return(
        <div>
            <div className="success-card">
                <h1>THANK YOU FOR YOUR ORDER! 🤍</h1>
                <p>תהליך ההשכרה הושלם והשמלה מחכה לך!</p>

                {rentingId && 
                (
                    <div className="success-details">
                        <p><strong>מספר הזמנה:</strong> {rentingId}</p>
                        <p><strong>טווח ההשכרה:</strong> מ-{rentDate} עד {returnDate}</p>
                    </div>
                )}
                <p>תודה שבחרת ב-primeLace</p>
                <button onClick={() => navi("/")}>
                     לעמוד הבית
                </button>
            </div>
        </div>
    )
}