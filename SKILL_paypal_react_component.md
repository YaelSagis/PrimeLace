# SKILL – הגדרת קומפוננטת React בשם PayPal

## מטרת הקומפוננטה
קומפוננטת PayPal מיועדת לאפשר תהליך תשלום עבור שמלה באתר באמצעות PayPal.
היא אמורה לשלב בין:
- כפתור PayPal
- שליחת הזמנה לשרת
- אישור תשלום מה-frontend
- העברת תוצאה להורה (הצלחה / כישלון / ביטול)

הקומפוננטה צריכה להיות רכיב Reusable, נקי ומבודד, כך שניתן להשתמש בה בדפים כמו תשלום, הזמנה או עמוד מוצר.

---

## 1. פרופסים נדרשים
הקומפוננטה צריכה לקבל את הפרופסים הבאים:

### פרופסים חובה
- `dressId` (string | number)
  - מזהה השמלה לה הזמנה מתבצעת
- `amount` (number)
  - סכום התשלום
- `currency` (string)
  - למשל: `ILS` או `USD`
- `onPaymentSuccess` (function)
  - פונקציה שתופעל כאשר התשלום הושלם בהצלחה
- `onPaymentError` (function)
  - פונקציה שתופעל במקרה של שגיאה
- `onPaymentCancel` (function)
  - פונקציה שתופעל כאשר המשתמש מבטל את התהליך

### פרופסים אופציונליים
- `userId` (string | number)
- `description` (string)
- `buttonLabel` (string)
  - ברירת מחדל: `Pay with PayPal`
- `className` (string)
- `disabled` (boolean)

---

## 2. סטייט פנימי
הקומפוננטה תנהל סטייט פנימי לפחות עבור:

- `isLoading` (boolean)
  - מציין אם התהליך בתהליך טעינה
- `error` (string | null)
  - שגיאה שמוצגת למשתמש
- `orderId` (string | null)
  - מזהה ההזמנה שנוצרה בשרת
- `isPayPalReady` (boolean)
  - מציין האם ה-SDK של PayPal נטען בהצלחה

### אפשרות נוספת
אם יש צורך, ניתן להוסיף:
- `isSubmitting`
- `paymentStatus`
- `resultMessage`

---

## 3. שלבי אינטגרציה עם PayPal SDK

### שלב 1 – התקנת הספרייה
התקנת חבילה:
```bash
npm install @paypal/react-paypal-js
```

### שלב 2 – עטיפת הקומפוננטה ב-Provider
יש להוסיף את ה-Provider של PayPal בדף שמכיל את הקומפוננטה:
```jsx
<PayPalScriptProvider options={{ "client-id": process.env.VITE_PAYPAL_CLIENT_ID }}>
  <PayPalComponent ... />
</PayPalScriptProvider>
```

### שלב 3 – יצירת הזמנה בשרת
כאשר המשתמש לוחץ על הכפתור, יש לבצע קריאת API לשרת:
```js
POST /api/payments/paypal/create-order
```

הבקשה צריכה לכלול:
- `dressId`
- `amount`
- `currency`
- `userId` (אם קיים)

השרת מחזיר:
- `orderId`

### שלב 4 – אישור התשלום
לאחר שהמשתמש מאשר את התשלום ב-PayPal, יש לקרוא ל-API:
```js
POST /api/payments/paypal/capture-order
```

הבקשה כוללת:
- `orderId`

### שלב 5 – טיפול בתוצאה
לאחר קבלת תשובה מהשרת:
- אם הצלחה → לקרוא ל-`onPaymentSuccess`
- אם כישלון → לקרוא ל-`onPaymentError`
- אם המשתמש ביטל → לקרוא ל-`onPaymentCancel`

---

## 4. זרימת UI מומלצת

### זרימת משתמש
1. הקומפוננטה נטענת עם מידע על שמלה ומחיר.
2. אם ה-SDK עדיין לא מוכן, מוצג Loader או כפתור לא פעיל.
3. המשתמש לוחץ על כפתור PayPal.
4. נפתח חלון/דיאלוג של PayPal.
5. המשתמש מאשר או מבטל את התשלום.
6. הקומפוננטה מעבירה את התוצאה להורה.
7. מוצגת הודעת הצלחה/שגיאה בהתאם.

### UX מומלץ
- להציג הודעת טעינה בזמן יצירת ההזמנה
- להציג שגיאה ברורה במקרה של כשלון
- לא לאפשר לחיצה כפולה בזמן התהליך
- להימנע ממצב של כפתור “לא זמין” ללא הסבר

---

## 5. טיפול בשגיאות
הקומפוננטה צריכה לטפל בשגיאות בצורה ברורה ומאורגנת.

### סוגי שגיאות
- שגיאה בטעינת PayPal SDK
- שגיאה ביצירת הזמנה
- שגיאה ב-capture
- ביטול התהליך על ידי המשתמש
- בעיית רשת או חיבור

### התנהגות מומלצת
- עדכן `error` עם הודעה ידידותית למשתמש
- כבה את הכפתור בזמן טעינה
- קרא ל-`onPaymentError` עם פרטים מתאימים
- אל תציג שגיאה גולמית בלבד; יש להמיר אותה להודעה קריאה

### דוגמה
```jsx
setError('Payment could not be completed. Please try again.');
```

---

## 6. אירועים שהקומפוננטה שולחת להורה
הקומפוננטה צריכה לשלוח אירועים להורה באמצעות פרופסים:

### `onPaymentSuccess`
צריך לקבל פרמטרים כגון:
```js
onPaymentSuccess({ orderId, amount, currency, dressId })
```

### `onPaymentError`
צריך לקבל פרמטרים כגון:
```js
onPaymentError({ message, error, orderId })
```

### `onPaymentCancel`
צריך לקבל פרמטרים כגון:
```js
onPaymentCancel({ orderId, message })
```

---

## 7. מבנה בסיסי של הקומפוננטה
הקומפוננטה אמורה להיות בנויה כך:

```jsx
function PayPalComponent({ dressId, amount, currency, onPaymentSuccess, onPaymentError, onPaymentCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const createOrder = async () => {
    // create order via server
  };

  const onApprove = async (data) => {
    // capture order via server
  };

  return (
    <div>
      {/* PayPal button / UI */}
    </div>
  );
}
```

---

## 8. הנחיות מומלצות לפיתוח
- יש להפריד בין לוגיקת UI לבין לוגיקת תשלום
- יש למנוע שרת-סייד secrets מהfrontend
- יש להשתמש ב-API של השרת ולא לבצע קריאות ישירות ל-PayPal מהלקוח
- יש לבדוק את כל שלבי התהליך ב-Sandbox
- יש ליישם טיפול שגיאות אחיד בכל המקרים

---

## 9. סיכום קצר
קומפוננטת PayPal צריכה להיות אחראית על:
- טעינה של ה-SDK
- יצירת הזמנה דרך השרת
- אישור תשלום
- העברת תוצאה ברורה להורה
- טיפול בשגיאות וביטולים

המטרה היא ליצור רכיב נגיש, בטוח, וניתן לשימוש חוזר בכל דף תשלום באתר.
