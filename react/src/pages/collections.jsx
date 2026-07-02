import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { getAllCategoriesThunk } from "../redux/slices/dressesSlice";

export function Collections()
{
    const dispatch = useDispatch();
    const navi = useNavigate();
    const {categoryId} = useParams();

    const categories = useSelector((state)=> {return state.dresses.categories});
    const categoriesStatus = useSelector((state)=> {return state.dresses.categoriesStatus});

    useEffect(()=>
    {
        if(categoriesStatus === 'idle')
            dispatch(getAllCategoriesThunk());
    }, [categoriesStatus, dispatch]);

    function selectCategory(categoryId)
    {
        navi(`/collections/${categoryId}`);
    }

    return(
        <div>
            {!categoryId && 
            (
                <>
                    <h1>הקולקציות שלנו</h1>
                    <p>בחרי את העונה המושלמת עבורך</p>

                    {
                        categoriesStatus === 'loading'? <p>טוען קולקציות...</p>:
                        categoriesStatus === 'succeeded'?
                        (
                            <div>
                                {categories.map((c)=>
                                    (
                                        <div key={c._id} onClick={() => { selectCategory(c._id)}}>
                                            <h2>{c.name}</h2>
                                            <img src={c.image} alt={c.name} />
                                        </div>
                                    )
                                )}
                            </div>
                        ):<p>שגיאה בטעינת הקטגוריות</p>
                    }
                </>
            )}
            <Outlet/>
        </div>
    )
}