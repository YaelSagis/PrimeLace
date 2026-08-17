import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DressCard } from "../components/presentation/dressCard";
import { getAllDressesThunk } from "../redux/slices/dressesSlice";
import { useEffect } from "react";
import "../styles/myFavorites.css"

export function MyFavorites() {
    const navi = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser);
    const allDresses = useSelector((state) => state.dresses.dresses) || [];
    const dressesStatus = useSelector((state) => state.dresses.status);
    
    const userFavoriteIds = currentUser?.favorites || [];

    useEffect(() => {
        dispatch(getAllDressesThunk());
    }, [dispatch]);

    const myFavoriteDresses = allDresses.filter(dress => 
        userFavoriteIds.includes(dress._id)
    );

    return (
        <div className="favorites-page">
            <h2 className="page-title">MY FAVORITES</h2>

            {dressesStatus === "loading"?(
                <p className="status-msg">טוען שמלות...</p>
            ) : myFavoriteDresses.length === 0 ? (
                <p className="status-msg">עדיין לא שמרת שמלות... עברי לקטלוג כדי להתחיל לבחור!</p>
            ) : (
                <div className="favorites-grid">
                    {myFavoriteDresses.map((dress) => (
                        <DressCard 
                            key={dress._id} 
                            dress={dress} 
                            func={(id) => navi(`/product/${id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}