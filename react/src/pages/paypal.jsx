import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPal } from '../components/presentation/paypal';
import '../styles/paypal.css';

export function PayPalPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { dressName = 'שמלה', amount = 0, currency = 'ILS' } = location.state || {};
    const [paymentMessage, setPaymentMessage] = useState('');

    const handleSuccess = (data) => {
        setPaymentMessage(`התשלום הושלם בהצלחה עבור ${data.dressName}.`);
        window.scrollTo(0, 0);
        navigate('/orderSuccess', {
            state: {
                rentingId: data.orderId,
                dressImage: location.state?.dressImage || '',
                rentDate: location.state?.rentDate || '',
                returnDate: location.state?.returnDate || '',
            },
        });
    };

    const handleError = () => {
        setPaymentMessage('הדמיית התשלום נכשלה. ניתן לנסות שוב.');
    };

    const handleCancel = () => {
        setPaymentMessage('הביטול הושלם בהצלחה.');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>תשלום עם PayPal</h2>
            <PayPal
                amount={amount}
                currency={currency}
                dressName={dressName}
                onPaymentSuccess={handleSuccess}
                onPaymentError={handleError}
                onPaymentCancel={handleCancel}
            />

            {paymentMessage && (
                <p style={{ textAlign: 'center', marginTop: '1rem', color: '#374151' }}>
                    {paymentMessage}
                </p>
            )}
        </div>
    );
}
