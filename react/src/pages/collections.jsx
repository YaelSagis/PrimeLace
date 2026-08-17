import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { getAllCategoriesThunk } from "../redux/slices/categoriesSlice";
import "../styles/collections.css";

export function Collections()
{
    const dispatch = useDispatch();
    const navi = useNavigate();
    const {categoryId} = useParams();

    const categories = useSelector((state)=> {return state.categories.categories});
    const categoriesStatus = useSelector((state)=> {return state.categories.status});

    useEffect(()=>
    {
        if(categoriesStatus === 'idle')
            dispatch(getAllCategoriesThunk());
    }, [categoriesStatus, dispatch]);

    function selectCategory(categoryId, categoryName)
    {
        navi(`/collections/${categoryId}`, {
            state: { categoryName }
        });
    }

    return(
        <div className="collections-container">
            {!categoryId && (
                <>
                    <div className="collections-header">
                        <h1>הקולקציות שלנו</h1>
                        <p className="collections-subtitle">בחרי את העונה המושלמת עבורך</p>
                    </div>

                    {categoriesStatus === 'loading' ? (
                        <div className="collections-status-msg">טוען קולקציות...</div>
                    ) : categoriesStatus === 'succeeded' ? (
                        <div className="collections-grid">
                            {categories.map((c) => (
                                <div className="collection-card" key={c._id}>
                                    <img src={c.image} alt={c.name} />
                                    <h2>{c.name}</h2>
                                    <button className="collection-btn" onClick={() => selectCategory(c._id, c.name)}>
                                        צפי בקולקציה
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="collections-status-msg error">שגיאה בטעינת הקטגוריות</div>
                    )}
                </>
            )}
            <Outlet/>
        </div>
    )
}