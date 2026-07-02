import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"

export function Payment()
{
    const location = useLocation();
    const navi = useNavigate();

    const {rentingId, dressId, rentDate, returnDate} = location.state || {};

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePaymentSubmit = (e) =>
    {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => 
        {
            setIsSubmitting(false);
            navi("/orderSuccess", 
                {
                    state: {rentingId, dressId, rentDate, returnDate}
                }
            );
        }, 1500);
    };

    if(!rentingId)
    {
        return(
            <h2>לא נבחרו פרטי הזמנה</h2>
        );
    }

    return(
        <div>
            <div className="order-summary">
                <h2>YOUR ORDER SUMMARY</h2>
                <h3>תאריך הזמנה</h3>
                <p>{rentDate} - {returnDate}</p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="credit-card-form">
                <h2>PAYMENT METHOD</h2>
                <p>Credit Card</p>
                <div>
                    <input
                        type="text" 
                        placeholder="שם בעל הכרטיס" 
                        value={cardName} 
                        onChange={(e) => setCardName(e.target.value)} 
                        required>
                    </input>
                </div>
                <div>
                    <input
                        type="text" 
                        placeholder="מספר כרטיס אשראי" 
                        maxLength="16"
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)} 
                        required>
                    </input>
                </div>
                <div>
                    <input
                        type="text" 
                        placeholder="תוקף (MM/YY)" 
                        maxLength="5"
                        value={expiry} 
                        onChange={(e) => setExpiry(e.target.value)} 
                        required >
                    </input>
                    <input
                        type="text"
                        placeholder="CVV"
                        maxLength="3"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required>
                    </input>
                </div>

                <button type="submit" disabled={isSubmitting}>אשרי תשלום</button>
            </form>
        </div>
    )
}