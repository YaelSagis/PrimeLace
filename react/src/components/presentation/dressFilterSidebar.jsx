import { useState } from "react";
import "../../styles/dressFilterSidebar.css";

const SORT_OPTIONS = [
    { value: "default", label: "מיון ברירת מחדל" },
    { value: "price-asc", label: "מחיר: מהנמוך לגבוה" },
    { value: "price-desc", label: "מחיר: מהגבוה לנמוך" },
    { value: "popular", label: "הכי מבוקשות" },
];


export function DressFilterSidebar({
    priceMin,
    priceMax,
    onPriceMinChange,
    onPriceMaxChange,
    sortBy,
    onSortChange,
    onReset,
    resultCount,
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const hasActiveFilters = priceMin !== "" || priceMax !== "" || sortBy !== "default";

    return (
        <aside className={`filter-sidebar ${mobileOpen ? "open" : ""}`}>
            <button
                type="button"
                className="filter-toggle-btn"
                onClick={() => setMobileOpen((prev) => !prev)}
            >
                מסננים ומיון {hasActiveFilters ? "•" : ""}
                <span className="filter-toggle-arrow">{mobileOpen ? "▲" : "▼"}</span>
            </button>

            <div className="filter-sidebar-content">
                <div className="filter-section">
                    <h4>מיון</h4>
                    <select
                        className="filter-select"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-section">
                    <h4>טווח מחיר (₪)</h4>
                    <div className="price-range-inputs">
                        <input
                            type="number"
                            min="0"
                            placeholder="מ-"
                            value={priceMin}
                            onChange={(e) => onPriceMinChange(e.target.value)}
                        />
                        <span className="price-range-sep">—</span>
                        <input
                            type="number"
                            min="0"
                            placeholder="עד"
                            value={priceMax}
                            onChange={(e) => onPriceMaxChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-footer">
                    <span className="filter-result-count">{resultCount} שמלות</span>
                    {hasActiveFilters && (
                        <button type="button" className="filter-reset-btn" onClick={onReset}>
                            איפוס מסננים
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
