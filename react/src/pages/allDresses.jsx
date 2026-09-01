import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DressCard } from "../components/presentation/dressCard";
import { DressFilterSidebar } from "../components/presentation/dressFilterSidebar";
import { getAllDressesThunk } from "../redux/slices/dressesSlice";
import { useDressFilters } from "../hooks/useDressFilters";
import "../styles/category.css";

/**
 * עמוד "כל השמלות" - כל הקטלוג במקום אחד כרשימה שטוחה אחת (בלי חלוקה
 * לקטגוריות - לזה כבר יש את עמוד הקולקציות), עם סרגל סינון/מיון שפועל
 * על הרשימה כולה.
 */
export function AllDresses() {
    const dispatch = useDispatch();
    const navi = useNavigate();

    const dresses = useSelector((state) => state.dresses.dresses);
    const dressesStatus = useSelector((state) => state.dresses.status);

    const {
        priceMin, setPriceMin,
        priceMax, setPriceMax,
        sortBy, setSortBy,
        resetFilters, filteredDresses
    } = useDressFilters(dresses);

    useEffect(() => {
        if (dressesStatus === 'idle') dispatch(getAllDressesThunk());
    }, [dressesStatus, dispatch]);

    const hasData = dresses?.length > 0;

    return (
        <div className="category-page-container">
            <h1 className="category-title">כל השמלות</h1>

            {!hasData ? (
                <div className="status-message loading">טוען שמלות...</div>
            ) : (
                <div className="category-body">
                    <DressFilterSidebar
                        priceMin={priceMin}
                        priceMax={priceMax}
                        onPriceMinChange={setPriceMin}
                        onPriceMaxChange={setPriceMax}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        onReset={resetFilters}
                        resultCount={filteredDresses.length}
                    />

                    <div className="category-main">
                        {filteredDresses.length === 0 ? (
                            <div className="status-message empty">
                                אין שמלות שתואמות למסננים שנבחרו
                            </div>
                        ) : (
                            <div className="dresses-grid">
                                {filteredDresses.map((d, index) => (
                                    <div key={d._id} className="dress-item-wrapper">
                                        <DressCard
                                            dress={d}
                                            func={(id) => navi(`/product/${id}`)}
                                            priority={index < 4}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
