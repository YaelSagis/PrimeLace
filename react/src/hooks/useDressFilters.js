import { useEffect, useMemo, useState } from "react";

/**
 * סינון לפי טווח מחיר + מיון עבור רשימת שמלות - משותף בין עמוד קטגוריה
 * ועמוד "כל השמלות". resetKey אופציונלי: כשהוא משתנה (למשל מעבר לקטגוריה
 * אחרת), המסננים מתאפסים אוטומטית.
 */
export function useDressFilters(dresses, resetKey) {
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [sortBy, setSortBy] = useState("default");

    const resetFilters = () => {
        setPriceMin("");
        setPriceMax("");
        setSortBy("default");
    };

    useEffect(() => {
        if (resetKey !== undefined) resetFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey]);

    const filteredDresses = useMemo(() => {
        if (!dresses) return [];

        let result = dresses.filter((d) => {
            const matchesMin = priceMin === "" || d.price >= Number(priceMin);
            const matchesMax = priceMax === "" || d.price <= Number(priceMax);
            return matchesMin && matchesMax;
        });

        if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
        else if (sortBy === "popular") result = [...result].sort((a, b) => (b.rentalCount || 0) - (a.rentalCount || 0));

        return result;
    }, [dresses, priceMin, priceMax, sortBy]);

    return { priceMin, setPriceMin, priceMax, setPriceMax, sortBy, setSortBy, resetFilters, filteredDresses };
}
