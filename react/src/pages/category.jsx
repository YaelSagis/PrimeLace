import { useDispatch, useSelector } from "react-redux";
import { DressCard } from "../components/presentation/dressCard";
import { DressFilterSidebar } from "../components/presentation/dressFilterSidebar";
import { useEffect } from "react";
import { getDressesByCategoryThunk } from "../redux/slices/dressesSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDressFilters } from "../hooks/useDressFilters";
import "../styles/category.css";

export function Category()
{
    const {categoryId} = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navi = useNavigate();

    const category = useSelector((state) => state.categories.categories.find((c) => c._id === categoryId));
    const categoryName = location.state?.categoryName || category?.name || "קולקציה";
    const dresses = useSelector((state) => state.dresses.dresses);
    const status = useSelector((state) => state.dresses.status);

    const {
        priceMin, setPriceMin,
        priceMax, setPriceMax,
        sortBy, setSortBy,
        resetFilters, filteredDresses
    } = useDressFilters(dresses, categoryId);

    useEffect(()=>
    {
        if(categoryId)
            dispatch(getDressesByCategoryThunk(categoryId));
    },[categoryId, dispatch]);

    return (
        <div className="category-page-container">
            <h1 className="category-title">{categoryName}</h1>

            {!dresses || dresses.length === 0 ? (
                status === 'failed' ? (
                    <div className="status-message error">שגיאה בטעינת השמלות</div>
                ) : status === 'loading' ? (
                    <div className="status-message loading">טוען שמלות...</div>
                ) : (
                    <div className="status-message empty">אין עדיין שמלות בקטגוריה זו</div>
                )
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
    )
}
