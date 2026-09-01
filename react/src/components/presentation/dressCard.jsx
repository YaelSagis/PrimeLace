import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToFavoritesThunk, removeFromFavoritesThunk } from "../../redux/slices/authSlice";
import { useToast } from "./toast";
import { getOptimizedImageUrl } from "../../utils/cloudinaryImage";
import "../../styles/dressCard.css";

export function DressCard({ dress, func, priority = false }) {

    const [imageLoaded, setImageLoaded] = useState(false);
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const currentUser = useSelector((state) => state.auth?.currentUser);

    if (!dress) {
        return <div>אין נתונים</div>;
    }

    const isFavorite = currentUser?.favorites?.includes(dress._id);

    const imageUrl = getOptimizedImageUrl(
        dress.images?.length > 0 ? dress.images[0] : "default-image.jpg"
    );

    const handleFavorite = (e) => {
        if (!currentUser) {
            showToast("חובה להתחבר כדי להוסיף שמלות למועדפים!", "error");
            return;
        }

        isFavorite
            ? dispatch(removeFromFavoritesThunk(dress._id))
            : dispatch(addToFavoritesThunk(dress._id));
    };

    return (
        <div className="dress-card">

            <div className="dress-img-container">
                <img
                    src={imageUrl}
                    alt={dress.name}
                    className={imageLoaded ? "dress-image loaded" : "dress-image"}
                    onLoad={() => setImageLoaded(true)}
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : "auto"}
                />
            </div>

            <h3 className="dress-name">{dress.name}</h3>

            <div className="card-actions">
                <button
                    className="view-details-btn"
                    onClick={() => func(dress._id)}
                >
                    View Details
                </button>

                <button
                    className="heart-btn"
                    onClick={handleFavorite}
                >
                    <img
                        src={
                            isFavorite
                                ? "https://res.cloudinary.com/x0um3j7c/image/upload/v1786874544/heart1_pblekm.png"
                                : "https://res.cloudinary.com/x0um3j7c/image/upload/v1786874543/heart2_raapd8.png"
                        }
                        alt="favorite"
                    />
                </button>
            </div>

        </div>
    );
}