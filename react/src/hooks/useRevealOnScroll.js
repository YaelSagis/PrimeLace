import { useEffect, useRef } from "react";

// מוסיף is-visible לכל אלמנט עם class="reveal" בתוך הקונטיינר ברגע שהוא נכנס למסך.
// deps - כדי לתפוס גם אלמנטים שנוספו מאוחר יותר (למשל אחרי טעינה מהשרת)
export function useRevealOnScroll(deps = []) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const elements = container.querySelectorAll(".reveal:not(.is-visible)");
        if (!("IntersectionObserver" in window)) {
            elements.forEach((el) => el.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return containerRef;
}
