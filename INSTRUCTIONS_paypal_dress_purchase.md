# INSTRUCTIONS – פיצ'ר חדש: קניית שמלה באמצעות PayPal

## מטרת הפיצ'ר
הוספת תהליך תשלום עבור שמלה דרך PayPal, כולל:
- בחירת שמלה מהאתר
- מעבר לדף תשלום
- יצירת הזמנה/אישור תשלום דרך PayPal
- שמירת סטטוס התשלום בשרת
- הצגת מסך הצלחה/כישלון למשתמש

---

## 1. הוראות צד לקוח

### 1.1 מבנה קומפוננטה מומלץ
יש להוסיף/לעדכן את הקומפוננטות הבאות ב-React:

- PaymentPage
  - אחראית על טעינת פרטי השמלה והמחיר
  - מקבלת מזהה שמלה מה-URL או מ-state
  - שולחת בקשת יצירה של הזמנה לשרת

- PayPalButtonWrapper
  - מכיל את כפתור ה-PayPal
  - מטפל ב-`createOrder`, `onApprove`, `onError`, `onCancel`

- OrderSummary
  - מציג סיכום הזמנה: תמונה, שם שמלה, מחיר, משלוח/עמלה אם יש

- PaymentResult
  - מציג מסך הצלחה או כישלון בהתאם לתשובה מהשרת

### 1.2 זרימת UI מומלצת
1. המשתמש בוחר שמלה בדף מוצר/אוסף.
2. לוחצים על כפתור “רכישה/תשלום”.
3. המשתמש מועבר לדף תשלום עם פרטי שמלה ומחיר.
4. הדף טוען את פרטי השמלה מהשרת.
5. מוצג כפתור PayPal.
6. לאחר לחיצה על PayPal, המשתמש מאשר את התשלום בחלון PayPal.
7. לאחר אישור, הלקוח שולח את האישור לשרת.
8. השרת מחזיר סטטוס של הצלחה/כישלון.
9. המשתמש מועבר למסך הצלחה או למסך שגיאה עם אפשרות לנסות שוב.

### 1.3 שילוב PayPal SDK
מומלץ להשתמש בספרייה:
- `@paypal/react-paypal-js`

#### שלבים
1. התקנת חבילה:
   ```bash
   npm install @paypal/react-paypal-js
   ```

2. הגדרת Client ID בסביבת React:
   ```env
   VITE_PAYPAL_CLIENT_ID=your_client_id
   ```

3. עטיפה של הדף ב-`PayPalScriptProvider`:
   ```jsx
   import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
   ```

4. מימוש פונקציות בסיסיות:
   ```jsx
   const createOrder = async () => {
     const res = await fetch('/api/payments/paypal/create-order', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ dressId })
     });

     const data = await res.json();
     return data.orderId;
   };

   const onApprove = async (data) => {
     const res = await fetch('/api/payments/paypal/capture-order', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ orderId: data.orderID })
     });

     const result = await res.json();
     if (result.success) {
       navigate('/order-success');
     }
   };
   ```

### 1.4 הנחיות UX
- להציג Loader בזמן טעינת התשלום.
- להציג הודעת שגיאה ברורה במקרה של כשלון.
- לא לאפשר פתיחת PayPal לפני שמילאו את כל השדות הדרושים.
- לשמור על חוויית מעבר חלקה בין דף התשלום למסך האישור.

### 1.5 מגבלות/שיקולים לקוח
- אין לאחסן סודות או מפתחות שרת בצד לקוח.
- לא לייצר הזמנה ישירות מה-frontend בלי לשרת את התהליך דרך ה-API.
- יש להבדיל בין יצירה של הזמנה (`createOrder`) לבין_CAPTURE (`captureOrder`).

---

## 2. הוראות צד שרת

### 2.1 יצירת API
מומלץ להוסיף ב-Express/Node.js את ה-EndPoints הבאים:

- `POST /api/payments/paypal/create-order`
  - מקבל מזהה שמלה, מזהה משתמש, ומידע רלוונטי להזמנה
  - יוצר הזמנה ב-PayPal ומחזיר `orderId`

- `POST /api/payments/paypal/capture-order`
  - מקבל את `orderId` מה-frontend
  - מבצע capture ל-PayPal
  - מעדכן את מסד הנתונים עם סטטוס התשלום

- `POST /api/payments/paypal/webhook` (אופציונלי, מומלץ)
  - מקבל התראות מ-PayPal על שינויי סטטוס
  - מעדכן את הסטטוס של ההזמנה באופן מאובטח

### 2.2 מבנה קבצים מומלץ
בהתאם למבנה הקיים, אפשר למקם את הלוגיקה כך:

- `controllers/paymentController.js`
  - לוגיקת בקרת התשלום

- `routers/paymentRouter.js`
  - הגדרת ה-API routes

- `services/paypalService.js`
  - כל הקוד לתקשורת עם PayPal

- `models/payment.js`
  - שמירת פרטי התשלום/ההזמנה

### 2.3 ולידציה
יש לבצע ולידציה לפני שליחת הבקשה ל-PayPal:

- בדוק שהמשתמש מחובר/מאומת
- בדוק שהשדה `dressId` קיים ותוקף
- בדוק שהמחיר תואם למחיר הנוכחי בשמלה
- בדוק שהסכום הוא מספר תקין וחיובי
- בדוק שהמטבעה תקינה (`ILS`, `USD` וכו')
- בדוק אם יש כבר הזמנה עם אותו `orderId` או `paymentId`

### 2.4 אימות מול PayPal
השרת חייב ליצור ולבצע capture מול PayPal באמצעות Access Token.

#### תהליך מומלץ
1. שליפת Access Token מ-PayPal
2. יצירת Order ב-PayPal
3. החזרת `orderId` ללקוח
4. כאשר הלקוח מאשר את התשלום, לבצע Capture
5. לאמת שהסטטוס הוא `COMPLETED`

#### דוגמאות ל-Endpoints של PayPal
- `POST https://api-m.sandbox.paypal.com/v2/checkout/orders`
- `POST https://api-m.sandbox.paypal.com/v2/checkout/orders/{id}/capture`

### 2.5 אבטחה
יש להקפיד על הנקודות הבאות:

- שמור את Client Secret רק בשרת
- אל תחשוף מפתחות ב-React או ב-Frontend
- השתמש ב-Environment Variables
- בדוק הרשאות משתמש לפני ביצוע תשלום
- שנה מצב תשלום רק כאשר האישור מגיע מהשרת ומה-PayPal
- השתמש ב-HTTPS בכל הסביבה המארחת
- אם יש שימוש ב-Cookie/Session, יש להגן עליהם מפני CSRF

### 2.6 טעויות וניהול שגיאות
יש לטפל בשגיאות באופן עקבי:

- שגיאת הרשאות: `401 Unauthorized`
- נתונים חסרים/לא תקינים: `400 Bad Request`
- הזמנה לא נמצאה: `404 Not Found`
- שגיאת PayPal: `502 Bad Gateway` או `500 Internal Server Error`
- ניסיון capture כפול: יש למנוע duplicate processing

#### דפוס מומלץ לתשובה
```json
{
  "success": false,
  "error": "Payment failed",
  "details": "PayPal capture returned a non-completed status"
}
```

### 2.7 שמירת נתונים
בעת הצלחה, יש לשמור ב-DB את הפרטים הבאים:

- `userId`
- `dressId`
- `orderId`
- `paymentId`
- `payerEmail`
- `amount`
- `currency`
- `status` (`pending`, `completed`, `failed`, `canceled`)
- `createdAt`, `updatedAt`

### 2.8 ניהול סטטוסים
מומלץ להחזיק לוגיקה ברורה של סטטוסים:

- `pending` – ההזמנה נוצרה, עדיין לא נסגרה
- `completed` – התשלום אושר על ידי PayPal
- `failed` – התשלום נכשל
- `canceled` – המשתמש ביטל את התהליך

---

## 3. המלצות לפיתוח

### 3.1 סדר ביצוע מומלץ
1. הוספת מסלולי API בשרת
2. יצירת שירות PayPal נפרד
3. חיבור React לדף התשלום
4. בדיקת Sandbox flow
5. טיפול בשגיאות וסטטוסים
6. בדיקות end-to-end

### 3.2 בדיקות חובה
- תשלום תקין
- ביטול תשלום על ידי המשתמש
- כשלון תשלום
- ניסיון capture כפול
- הזמנה עם מחיר לא תקין
- משתמש לא מחובר

### 3.3 סביבת פיתוח
עדיף לעבוד עם:
- Sandbox PayPal account
- משתני סביבה נפרדים ל-development ו-production
- לוגים ברורים לכל שלב של התהליך

---

## 4. סיכום טכני קצר
הפיצ'ר צריך להיות מבוסס על 3 שכבות עיקריות:
- Frontend: תצוגה, UX, שליחת בקשות לשרת
- Backend: יצירת הזמנה, אימות, capture, שמירת סטטוס
- PayPal: שירות תשלום חיצוני, בדיקת מצב ואישור

העיקרון המרכזי הוא: לא לבצע תשלום ישירות מהלקוח; כל שלב קריטי צריך להתבצע דרך השרת.
