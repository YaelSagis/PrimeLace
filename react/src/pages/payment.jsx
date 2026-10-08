import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addPayments } from "../API/rentingsApi";
import { PayPal } from "../components/presentation/paypal";
import "../styles/payment.css";

export function Payment() {
    const location = useLocation();
    const navi = useNavigate();

    const {
        rentingId,
        rentDate,
        dressImage,
        returnDate,
        totalAmount,
        dressName,
    } = location.state || {};

    const [numPayments, setNumPayments] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitPayment = async (method = paymentMethod) => {
        setIsSubmitting(true);

        const paymentData = {
            rentId: rentingId,
            numPayments: Number(numPayments),
            totalAmount: totalAmount,
            paymentMethod: method,
            cardDetails: { cardName, cardNumber, expiry, cvv },
        };

        try {
            await addPayments(paymentData);
            setIsSubmitting(false);
            navi("/orderSuccess", {
                state: { rentingId, dressImage, rentDate, returnDate },
            });
        } catch (err) {
            alert("הייתה שגיאה בביצוע התשלום במערכת.");
            setIsSubmitting(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === "paypal") {
            return;
        }

        await submitPayment("credit_card");
    };

    const handlePayPalSuccess = async () => {
        await submitPayment("paypal");
    };

    const handlePayPalError = () => {
        setIsSubmitting(false);
        alert("התרחשה שגיאה בתהליך התשלום.");
    };

    const handlePayPalCancel = () => {
        setIsSubmitting(false);
        alert("הפעולה בוטלה.");
    };

    return (
        <div className="payment-page-container">
            <div className="order-summary-card">
                <h2>YOUR ORDER SUMMARY</h2>
                {dressImage && <img src={dressImage} alt="Dress" className="summary-dress-img" />}
                <div className="summary-content">
                    <p><strong>תאריכי השכרה:</strong> {rentDate} - {returnDate}</p>
                    <div className="total-divider"></div>
                    <p className="total-amount"><strong>סה"כ לתשלום:</strong> {totalAmount} ₪</p>
                </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="payment-form">
                <h2>PAYMENT METHOD</h2>

                <div className="payment-method-card">
                    <label className="payment-method-label">אמצעי תשלום:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-select"
                    >
                        <option value="credit_card">כרטיס אשראי</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                <label className="payment-method-label">מספר תשלומים:</label>
                <select
                    value={numPayments}
                    onChange={(e) => setNumPayments(Number(e.target.value))}
                    className="form-select"
                >
                    {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>{num} תשלומים</option>
                    ))}
                </select>

                {paymentMethod === "credit_card" ? (
                    <>
                        <h3>פרטי כרטיס אשראי</h3>
                        <p className="payment-method-note">
                            זהו תהליך הדמיה בלבד - הפרטים אינם נשמרים ולא מתבצע חיוב אמיתי.
                        </p>
                        <input
                            type="text"
                            placeholder="שם בעל הכרטיס"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="form-input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="מספר כרטיס"
                            maxLength="16"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="form-input"
                            required
                        />

                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength="5"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                className="form-input"
                                required
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                maxLength="3"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? "מעבד תשלום..." : "השלמת הזמנה"}
                        </button>
                    </>
                ) : (
                    <div className="paypal-section">
                        <h3>תשלום דרך PayPal</h3>
                        <p className="payment-method-note">
                            זהו תהליך הדמיה בלבד, ללא חיבור אמיתי ל-PayPal.
                        </p>
                        <PayPal
                            amount={Number(totalAmount || 0)}
                            currency="ILS"
                            dressName={dressName || "שמלה להשכרה"}
                            onPaymentSuccess={handlePayPalSuccess}
                            onPaymentError={handlePayPalError}
                            onPaymentCancel={handlePayPalCancel}
                        />
                    </div>
                )}
            </form>
        </div>
    );
}