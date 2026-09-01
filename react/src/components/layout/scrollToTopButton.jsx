import { useEffect, useState } from "react";
import "../../styles/scrollToTopButton.css";

/**
 * כפתור "חזרה לראש העמוד" צף, מופיע רק אחרי גלילה משמעותית כלפי מטה.
 * תוספת קטנה ונפוצה באתרי קמעונאות מקצועיים.
 */
export function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                setVisible(window.scrollY > 600);
                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            type="button"
            className={`scroll-top-btn ${visible ? "visible" : ""}`}
            onClick={scrollToTop}
            aria-label="חזרה לראש העמוד"
            title="חזרה לראש העמוד"
        >
            ↑
        </button>
    );
}
