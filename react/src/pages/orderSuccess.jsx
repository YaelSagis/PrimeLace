import { useLocation, useNavigate } from "react-router-dom";
import "../styles/orderSuccess.css"

export function OrderSuccess() {
    const location = useLocation();
    const navi = useNavigate();
    const { rentingId, dressImage, rentDate, returnDate } = location.state || {};

    return (
        <div className="success-page-wrapper">
            <div className="success-card">
                {dressImage && <img src={dressImage} alt="Selected Dress" className="success-dress-img" />}
                
                <h1 className="success-title">THANK YOU FOR YOUR ORDER! 🤍</h1>
                <p className="success-subtitle">תהליך ההשכרה הושלם והשמלה מחכה לך!</p>

                {rentingId && (
                    <div className="success-details">
                        <p><strong>מספר הזמנה:</strong> {rentingId}</p>
                        <p><strong>טווח ההשכרה:</strong> מ-{rentDate} עד {returnDate}</p>
                    </div>
                )}
                
                <p className="brand-note">תודה שבחרת ב-primeLace</p>
                
                <button className="home-btn" onClick={() => navi("/")}>
                    לעמוד הבית
                </button>
            </div>
        </div>
    );
}