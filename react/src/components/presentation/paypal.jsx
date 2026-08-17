import { useState } from 'react';
import '../../styles/paypal.css';

export function PayPal({
    amount = 0,
    currency = 'ILS',
    dressName = 'שמלה',
    onPaymentSuccess,
    onPaymentError,
    onPaymentCancel,
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handlePay = () => {
        setIsProcessing(true);
        setStatus('processing');
        setMessage('יוצר חיבור דמו ל-PayPal...');

        window.setTimeout(() => {
            const mockOrderId = `DEMO-${Math.floor(Math.random() * 900000) + 100000}`;
            setIsProcessing(false);
            setStatus('success');
            setMessage(`התשלום הושלם בהצלחה. מספר הזמנה: ${mockOrderId}`);

            onPaymentSuccess?.({
                orderId: mockOrderId,
                amount,
                currency,
                dressName,
            });
        }, 1800);
    };

    const handleCancel = () => {
        setIsProcessing(false);
        setStatus('canceled');
        setMessage('הפעולה בוטלה על ידי המשתמש.');
        onPaymentCancel?.({ message: 'User canceled the demo payment' });
    };

    const handleSimulateError = () => {
        setIsProcessing(false);
        setStatus('error');
        setMessage('הדמיית שגיאה: לא ניתן להשלים את התשלום כרגע.');
        onPaymentError?.({ message: 'Demo payment failed' });
    };

    return (
        <div className="paypal-demo-card">
            <div className="paypal-demo-header">
                <div className="paypal-logo">PayPal</div>
                <span className="paypal-demo-badge">Demo mode</span>
            </div>

            <p className="paypal-demo-title">תשלום עבור {dressName}</p>
            <p className="paypal-demo-amount">
                {amount.toLocaleString()} {currency}
            </p>

            <p className="paypal-demo-note">
                זהו תהליך הדמיה בלבד, ללא חיבור אמיתי ל-PayPal.
            </p>

            {message && (
                <div className={`paypal-demo-status ${status}`}>
                    {message}
                </div>
            )}

            <div className="paypal-demo-actions">
                <button
                    className="paypal-demo-btn primary"
                    onClick={handlePay}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'מעבד...' : 'המשך עם PayPal'}
                </button>

                <button
                    className="paypal-demo-btn secondary"
                    onClick={handleCancel}
                    disabled={isProcessing}
                >
                    ביטול
                </button>
            </div>

            <button
                className="paypal-demo-btn tertiary"
                onClick={handleSimulateError}
                disabled={isProcessing}
            >
                הדמיית שגיאה
            </button>
        </div>
    );
}
