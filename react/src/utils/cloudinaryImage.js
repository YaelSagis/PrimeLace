// מוסיף טרנספורמציה של Cloudinary (פורמט/איכות אוטומטיים + הגבלת רוחב) כדי
// לא לטעון תמונות מקור גדולות שלא לצורך - למשל תמונה ראשית לא צריכה להיות
// ברוחב מלא של המצלמה, ותמונה ממוזערת (thumbnail) בטח שלא.
export function getOptimizedImageUrl(url, width = 700) {
    if (!url || !url.includes("res.cloudinary.com")) {
        return url;
    }

    if (!url.includes("/upload/")) {
        return url;
    }

    return url.replace(
        "/upload/",
        `/upload/f_auto,q_auto,w_${width}/`
    );
}
