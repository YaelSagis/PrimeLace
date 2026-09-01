import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORAGE_PREFIX = "scrollPos:";

function readSavedPosition(key) {
    try {
        const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
        return raw === null ? null : Number(raw);
    } catch {
        // sessionStorage may be unavailable (private browsing, etc.)
        return null;
    }
}

function savePosition(key, y) {
    try {
        sessionStorage.setItem(STORAGE_PREFIX + key, String(y));
    } catch {
        // fail silently - not critical
    }
}

// רענון ידני (F5 / כפתור הרענון) מדווח ע"י React Router בדיוק כמו לחיצה על
// Back - אותו navigationType="POP", ואותו location.key (הדפדפן לא יוצר
// רשומת היסטוריה חדשה ברענון, אז המפתח נשמר). בלי הבדיקה הזו, רענון "נראה"
// בדיוק כמו חזרה אחורה - והעמוד היה נשאר במיקום הגלילה הישן במקום לחזור
// לראש, כפי שמצופה מרענון רגיל. ה-Navigation Timing API הוא הדרך התקנית
// להבדיל בין השניים.
function isPageReload() {
    try {
        return performance.getEntriesByType("navigation")[0]?.type === "reload";
    } catch {
        return false;
    }
}

// כמה זמן ממשיכים "לרדוף" אחרי מיקום הגלילה השמור לפני שמוותרים. חייב
// להיות ארוך מספיק כדי לתת לתמונות ולווידאו (עמוד הבית!) להיטען ולדחוף
// את גובה העמוד - זו בדיוק הסיבה שגרסה קודמת של זה לא עבדה טוב.
const RESTORE_WINDOW_MS = 3000;

/**
 * משחזר את מיקום הגלילה כשחוזרים אחורה עם כפתור ה-Back של הדפדפן,
 * בדיוק כמו באתרים סטנדרטיים (כגון SHEIN). בניווט רגיל קדימה (לחיצה על
 * קישור בתפריט וכו') תמיד קופצים לראש העמוד החדש, כמצופה.
 *
 * הבעיה המקורית: React Router לא משחזר גלילה בעצמו, והדפדפן כן מנסה
 * לשחזר - אבל בדיוק ברגע ה-Back, לפני שהנתונים האסינכרוניים (fetch)
 * נטענו מחדש והעמוד "קצר" מדי, כך שהשחזור נכשל ותמיד קופצים לראש.
 *
 * הפתרון: משביתים את שחזור הדפדפן האוטומטי, שומרים בעצמנו את מיקום
 * הגלילה של כל עמוד (sessionStorage, לפי מזהה ההיסטוריה הייחודי של
 * React Router). בחזרה אחורה, לא מספיק "לנסות פעם אחת ולוותר" - בעמוד
 * הבית למשל יש וידאו רקע ועשרות תמונות שממשיכות לטעון ולשנות את גובה
 * העמוד גם שניות אחרי הניווט. לכן אנחנו עוקבים עם ResizeObserver אחרי
 * כל שינוי בגובה הדף וממשיכים "לתקן" את מיקום הגלילה במשך חלון זמן
 * (RESTORE_WINDOW_MS), ומפסיקים מוקדם אם המשתמשת עצמה מתחילה לגלול ביד.
 */
export function useScrollRestoration() {
    const location = useLocation();
    const navigationType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"
    const currentKeyRef = useRef(location.key);

    useEffect(() => {
        if (typeof window === "undefined" || !("scrollRestoration" in window.history)) return;
        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        return () => {
            window.history.scrollRestoration = previous;
        };
    }, []);

    // מאזין גלילה יחיד וקבוע (לא נרשם/מוסר מחדש בכל ניווט) ששומר תמיד
    // תחת המפתח הנוכחי לפי currentKeyRef. זה קריטי: אם המאזין היה נתלה
    // מחדש בכל שינוי ניווט (כפי שהיה בעבר), יש חלון זמן שבו אירוע scroll
    // שנגרם מהניווט עצמו (למשל ה-scrollTo(0,0) של העמוד החדש, או שהדפדפן
    // בעצמו "תוקע" את הגלילה כשהעמוד הישן נעלם ומתקצר) עדיין נתפס ע"י
    // המאזין הישן ונשמר בטעות תחת מפתח העמוד שעזבנו - ומוחק לו את המיקום
    // האמיתי שהיה שם. במקום זה משתמשים במאזין אחד קבוע לאורך כל חיי
    // הרכיב, ורק current KeyRef מתעדכן - וזה קורה למטה, בתוך אותו
    // useLayoutEffect שגם קורא ל-scrollTo, כדי שהעדכון יהיה סינכרוני
    // וקודם לכל אירוע scroll שאותו scrollTo עלול לגרום לו.
    useEffect(() => {
        let rafId = null;
        const handleScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                savePosition(currentKeyRef.current, window.scrollY);
                rafId = null;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    useLayoutEffect(() => {
        const key = location.key;
        // עדכון סינכרוני, לפני כל scrollTo למטה - ראו הסבר למעלה
        currentKeyRef.current = key;

        if (navigationType !== "POP" || isPageReload()) {
            // ניווט "קדימה" רגיל (לחיצה על קישור), או רענון ידני של הדפדפן -
            // בשני המקרים תמיד חוזרים לראש העמוד, כמצופה
            if (!location.hash) {
                window.scrollTo(0, 0);
            }
            return;
        }

        const savedY = readSavedPosition(key);
        if (savedY === null || savedY <= 0) {
            window.scrollTo(0, 0);
            return;
        }

        let cancelled = false;
        let rafId = null;

        const applyScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo(0, Math.min(savedY, Math.max(maxScroll, 0)));
        };

        applyScroll();

        // ממשיכים לתקן בכל פריים כל עוד אנחנו בתוך חלון הזמן
        const startedAt = Date.now();
        const tick = () => {
            if (cancelled) return;
            applyScroll();
            if (Date.now() - startedAt < RESTORE_WINDOW_MS) {
                rafId = requestAnimationFrame(tick);
            }
        };
        rafId = requestAnimationFrame(tick);

        // תמונות/וידאו שמסיימים לטעון משנים את גובה הדף - מגיבים לזה מיד
        // בלי לחכות לפריים הבא
        const resizeObserver = new ResizeObserver(() => {
            if (!cancelled) applyScroll();
        });
        resizeObserver.observe(document.body);

        // אם המשתמשת מתחילה לגלול ביד תוך כדי השחזור - מפסיקים "להילחם" בה
        const stopOnManualScroll = () => {
            cancelled = true;
        };
        window.addEventListener("wheel", stopOnManualScroll, { passive: true, once: true });
        window.addEventListener("touchmove", stopOnManualScroll, { passive: true, once: true });

        const stopTimer = setTimeout(() => {
            cancelled = true;
        }, RESTORE_WINDOW_MS);

        return () => {
            cancelled = true;
            if (rafId) cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            clearTimeout(stopTimer);
            window.removeEventListener("wheel", stopOnManualScroll);
            window.removeEventListener("touchmove", stopOnManualScroll);
        };
    }, [location.key, navigationType, location.hash]);
}
