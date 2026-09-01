import { useScrollRestoration } from "../../hooks/useScrollRestoration";

/**
 * רכיב "שקט" שרק מפעיל את הוק שחזור הגלילה. חייב לשבת בתוך <BrowserRouter>
 * כדי שיהיה לו גישה למיקום (location) הנוכחי.
 */
export function ScrollManager() {
    useScrollRestoration();
    return null;
}
