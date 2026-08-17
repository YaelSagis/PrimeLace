import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToFavoritesThunk, removeFromFavoritesThunk } from "../../redux/slices/authSlice";
import "../../styles/dressCard.css";

export function DressCard(props)
{
    const dress = props.dress;
    const func = props.func;

    if(!dress)
        return <div>אין נתונים</div>

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth?.currentUser);
    const isFavorite = currentUser?.favorites?.includes(dress._id);

    const handleFavorite = (e) => {
        if (!currentUser) {
            alert("חובה להתחבר כדי להוסיף שמלות למועדפים!");
            return;
        }
        isFavorite ? dispatch(removeFromFavoritesThunk(dress._id)) : dispatch(addToFavoritesThunk(dress._id));
    };

    return(
        <div className="dress-card">
            <div className="dress-img-container">
                <img src={dress.images && dress.images.length > 0 ? dress.images[0] : 'default-image.jpg'} />
            </div>
            <h3 className="dress-name">{dress.name}</h3>
            <div className="card-actions">
                <button className="view-details-btn" onClick={() => func(dress._id)}>
                    View Details
                </button>
                <button className="heart-btn" onClick={handleFavorite}>
                    <img src={isFavorite? "https://res.cloudinary.com/x0um3j7c/image/upload/v1786874544/heart1_pblekm.png": "https://res.cloudinary.com/x0um3j7c/image/upload/v1786874543/heart2_raapd8.png"} alt="favorite"/>
                </button>
            </div>
        </div>
    )
}