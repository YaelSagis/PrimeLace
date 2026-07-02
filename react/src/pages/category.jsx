import { useDispatch, useSelector } from "react-redux";
import { DressCard } from "../components/presentation/dressCard";
import { useEffect } from "react";
import { getDressesByCategoryThunk } from "../redux/slices/dressesSlice";
import { useNavigate, useParams } from "react-router-dom";

export function Category()
{
    const {categoryId} = useParams();
    const dispatch = useDispatch();
    const navi = useNavigate();

    const dresses = useSelector((state) => state.dresses.dresses);
    const status = useSelector((state) => state.dresses.dressStatus);

    useEffect(()=>
    {
        if(categoryId)
            dispatch(getDressesByCategoryThunk(categoryId));
    },[categoryId, dispatch]);

    return(
        <>
            {
                status === 'loading'? <p>טוען שמלות...</p>:
                status === 'succeeded'?
                    <div>
                        {dresses && dresses.map((d)=>
                        (
                            <DressCard
                                key={d._id}
                                dress={d}
                                func={(id) => navi(`/product/${id}`)}>
                            </DressCard>
                        )
                        )}
                    </div>
                :<p>שגיאה בטעינת השמלות</p>
            }
        </>
    )
}