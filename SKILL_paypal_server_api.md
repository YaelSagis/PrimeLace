# SKILL – הגדרת API בצד שרת עבור תהליך רכישת שמלה דרך PayPal

## מטרת ה-API
API זה אחראי על כל שלבי תהליך התשלום של שמלה באמצעות PayPal בצד השרת:
- יצירת הזמנה ב-PayPal
- איסוף אישור מהלקוח
- capture של התשלום
- עדכון סטטוס ההזמנה במסד הנתונים
- טיפול בשגיאות, אבטחה ולוגים

ה-API צריך להיות ממוקם בצד השרת בלבד, כדי להבטיח שמפתחות/סודות לא ייחשפו ל-frontend.

---

## 1. נקודות קצה נדרשות (Endpoints)

### 1.1 POST /api/payments/paypal/create-order
יצירת הזמנה חדשה ב-PayPal.

#### קלט צפוי
```json
{
  "dressId": 12,
  "userId": 5,
  "amount": 2500,
  "currency": "ILS",
  "description": "Bridal dress purchase"
}
```

#### פלט צפוי
```json
{
  "success": true,
  "orderId": "PAYPAL_ORDER_ID",
  "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?..."
}
```

#### תפקיד ה-endpoint
- לאמת כי המשתמש מחובר
- לאמת את פרטי השמלה והמחיר
- ליצור הזמנה ב-PayPal
- להחזיר ל-frontend את ה-`orderId`

---

### 1.2 POST /api/payments/paypal/capture-order
ביצוע capture לאחר שאושר התשלום ב-PayPal.

#### קלט צפוי
```json
{
  "orderId": "PAYPAL_ORDER_ID"
}
```

#### פלט צפוי
```json
{
  "success": true,
  "message": "Payment completed successfully",
  "paymentId": "PAYPAL_PAYMENT_ID",
  "status": "COMPLETED"
}
```

#### תפקיד ה-endpoint
- לאמת את ה-`orderId`
- לבצע capture מול PayPal
- לאמת שהסטטוס הגיע ל-`COMPLETED`
- לעדכן את מסד הנתונים עם סטטוס הצלחה

---

### 1.3 POST /api/payments/paypal/webhook (אופציונלי, מומלץ)
קבלת התראות מ-PayPal על שינויי סטטוס.

#### קלט צפוי
Header:
```http
PayPal-Transmission-ID: ...
PayPal-Transmission-Sig: ...
PayPal-Webhook-Id: ...
```

Body:
```json
{
  "event_type": "CHECKOUT.ORDER.APPROVED",
  "resource": {
    "id": "PAYPAL_ORDER_ID"
  }
}
```

#### תפקיד ה-endpoint
- לאמת את ההודעה מול PayPal
- לעדכן את הסטטוס של ההזמנה באופן מאובטח

---

## 2. סכמת קלט/פלט

### 2.1 create-order – קלט
```ts
interface CreateOrderInput {
  dressId: string | number;
  userId?: string | number;
  amount: number;
  currency: string;
  description?: string;
}
```

### 2.2 create-order – פלט
```ts
interface CreateOrderOutput {
  success: boolean;
  orderId?: string;
  approvalUrl?: string;
  error?: string;
}
```

### 2.3 capture-order – קלט
```ts
interface CaptureOrderInput {
  orderId: string;
}
```

### 2.4 capture-order – פלט
```ts
interface CaptureOrderOutput {
  success: boolean;
  message?: string;
  paymentId?: string;
  status?: string;
  error?: string;
}
```

---

## 3. שלבי אימות מול PayPal בצד שרת

### שלב 1 – קבלת Access Token
השרת צריך לייצר Access Token מ-PayPal באמצעות Client ID ו-Client Secret.

### שלב 2 – יצירת הזמנה
השרת שולח בקשה ל-PayPal ליצירת Order עם:
- סכום
- מטבע
- תיאור
- חזרה ל-frontend אחרי אישור/ביטול

### שלב 3 – חזרה ללקוח
השרת מחזיר את ה-`orderId` וה-URL של אישור התשלום.

### שלב 4 – capture
לאחר קבלת אישור מהלקוח, השרת שולח capture ל-PayPal.

### שלב 5 – אימות סטטוס
השרת חייב לבדוק כי PayPal החזיר:
- `status: COMPLETED`
- `purchase_units` תקין
- `payer` קיים אם נדרש

---

## 4. דרישות אבטחה

### 4.1 אימות משתמש
- יש לאמת כי המשתמש מחובר לפני יצירת הזמנה
- יש לבדוק הרשאות גישה עבור כל פעולה

### 4.2 שמירת סודות
- Client Secret חייב להישמר רק בשרת
- אסור לשמור אותו ב-frontend או בקוד צד לקוח
- יש להשתמש ב-Environment Variables

### 4.3 אימות בקשות
- יש לוודא שהבקשה מגיעה ממקור תקין
- במקרה של webhook, יש לאמת חתימות PayPal
- יש להגן על ה-API מפני CSRF/טוקנים לא תקינים אם משתמשים ב-session/cookie

### 4.4 הגנה על כפילויות
- יש למנוע duplicate capture
- יש להימנע מיצירת הזמנה כפולה לאותה שמלה באותה סשן

### 4.5 HTTPS
- כל התקשורת צריכה להיות על HTTPS בסביבת production

---

## 5. טיפול בשגיאות

### 5.1 סיווג שגיאות
יש לטפל בשגיאות באופן עקבי:

- `400 Bad Request` – נתונים חסרים/לא תקינים
- `401 Unauthorized` – משתמש לא מאומת
- `403 Forbidden` – אין הרשאה לבצע את הפעולה
- `404 Not Found` – הזמנה/שמלה לא קיימת
- `409 Conflict` – הזמנה כבר טופלה או קיים כפילות
- `500 Internal Server Error` – שגיאת שרת או PayPal

### 5.2 דפוס תשובה לשגיאה
```json
{
  "success": false,
  "error": "Payment failed",
  "details": "PayPal capture returned a non-completed status"
}
```

### 5.3 טיפול מומלץ
- לנהל שגיאות PayPal בצורה ברורה
- לא להחזיר stack trace למשתמש בסביבה ציבורית
- לתעד את השגיאה בלוגים
- להחזיר הודעה ידידותית למשתמש

---

## 6. לוגים וניטור

### 6.1 לוגים נדרשים
יש לכתוב לוגים עבור:
- יצירת הזמנה
- capture הצלחה
- capture כישלון
- ביטול תהליך
- שגיאת אימות
- שגיאת PayPal

### 6.2 מידע מומלץ בלוג
- `userId`
- `dressId`
- `orderId`
- `paymentId`
- `status`
- `timestamp`
- `errorMessage`

### 6.3 ניטור
יש לנטר:
- שיעור כישלונות תשלום
- rate limit / failed requests
- שגיאות משלוח ל-PayPal
- אירועים חריגים של כפילות / חזרה על capture

---

## 7. מבנה קבצים מומלץ
- `controllers/paymentController.js`
  - לוגיקת ה-API
- `routers/paymentRouter.js`
  - הגדרת routes
- `services/paypalService.js`
  - קריאות ל-PayPal ו-Authentication
- `models/payment.js`
  - שמירת נתוני התשלום

---

## 8. שלבי מימוש מומלצים
1. הוספת routes ל-API
2. יצירת שירות PayPal נפרד
3. שילוב עם auth middleware
4. שמירת תוצאות התשלום ב-DB
5. הוספת לוגים וניטור
6. בדיקת Sandbox flow

---

## 9. סיכום קצר
ה-API חייב להבטיח שהעברת התשלום מתבצעת באופן בטוח, מאובטח ומנותק מה-frontend.
העקרונות המרכזיים הם:
- אימות משתמש
- יצירת הזמנה דרך PayPal
- capture מאומת ומאובטח
- שמירה של סטטוס התשלום
- טיפול שגיאות ברורות ולוגים מעקב
