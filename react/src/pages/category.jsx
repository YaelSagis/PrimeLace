import { useDispatch, useSelector } from "react-redux";
import { DressCard } from "../components/presentation/dressCard";
import { useEffect } from "react";
import { addDressThunk, deleteDressThunk, getDressesByCategoryThunk } from "../redux/slices/dressesSlice";
import { useNavigate, useParams } from "react-router-dom";

export function Category()
{
    const {categoryId} = useParams();
    const dispatch = useDispatch();
    const navi = useNavigate();

    const dresses = useSelector((state) => state.dresses.dresses);
    const status = useSelector((state) => state.dresses.dressStatus);

    const currentUser = useSelector((state) => state.auth?.user);
    const isAdmin = currentUser && currentUser.userType === 'admin';

    const [name, setName] = useState("");
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");

    useEffect(()=>
    {
        if(categoryId)
            dispatch(getDressesByCategoryThunk(categoryId));
    },[categoryId, dispatch]);

    const handleAddDress = (e)=>
    {
        e.preventDefault();

        const newDress = {
            name,
            size: Number(size) || 0,
            color,
            price: Number(price),
            image,
            category: categoryId
        };

        dispatch(addDressThunk(newDress));
        
        setName("");
        setSize("");
        setColor("");
        setPrice("");
        setImage("");
    }

    const handleDeleteDress = (id) =>
    {
        dispatch(deleteDressThunk(id));
    }

    return(
        <>
            {isAdmin && (
                <div>
                    <h3>הוספת שמלה חדשה לקטגוריה</h3>
                    <form onSubmit={handleAddDress}>
                        <input type="text" placeholder="שם השמלה" value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type="number" placeholder="מידה" value={size} onChange={(e) => setSize(e.target.value)} />
                        <input type="text" placeholder="צבע" value={color} onChange={(e) => setColor(e.target.value)} />
                        <input type="number" placeholder="מחיר השכרה" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        <input type="text" placeholder="קישור לתמונה" value={image} onChange={(e) => setImage(e.target.value)} />
                        <button type="submit">הוסף שמלה</button>
                    </form>
                    <hr />
                </div>
            )}

            {
                status === 'loading' || status === 'idle' ?<p>טוען שמלות...</p>:
                status === 'succeeded'?
                (
                    dresses && dresses.length === 0?
                    (
                        <p>אין עדיין שמלות בקטגוריה זו</p>
                    ):
                    <div>
                        {dresses.map((d)=>
                        (
                            <div>
                                <DressCard
                                    key={d._id}
                                    dress={d}
                                    func={(id) => navi(`/product/${id}`)}>
                                </DressCard>
                                {isAdmin && (
                                    <button onClick={() => handleDeleteDress(d._id)}>מחק שמלה</button>
                                )}
                            </div>
                        )
                        )}
                    </div>
                )
                :<p>שגיאה בטעינת השמלות</p>
            }
        </>
    )
}