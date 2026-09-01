import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addReviewThunk, getDressByIdThunk } from "../redux/slices/dressesSlice";
import { createRenting } from "../API/rentingsApi";
import { addToFavoritesThunk, removeFromFavoritesThunk } from "../redux/slices/authSlice";
import { format } from "date-fns";
import { useToast } from "../components/presentation/toast";
import { getOptimizedImageUrl } from "../utils/cloudinaryImage";
import "../styles/productDetails.css";


export function ProductDetails()
{
    const { dressId } = useParams();
    const dispatch = useDispatch();
    const navi = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    const dress = useSelector((state) => state.dresses.currentDress);
    const status = useSelector((state) => state.dresses.status);
    const currentUser = useSelector((state) => state.auth.currentUser);

    const isAdmin = currentUser?.userType === "admin";

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => 
    {
        setCurrentIndex((prev) => (prev + 1) % dress.images.length);
    };

    const prevImage = () => 
    {
        setCurrentIndex((prev) => (prev - 1 + dress.images.length) % dress.images.length);
    };

    const [selectedSize, setSelectedSize] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]);

    useEffect(() =>
    {
        if (dressId)
            dispatch(getDressByIdThunk(dressId));


    }, [dressId, dispatch]);

    useEffect(() => 
    {
        setRentalRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: "selection"
            }
        ]);
    }, [selectedSize]);

    // Favorites

    const isFavorite = currentUser?.favorites?.includes(dressId);

    const handleFavorite = () =>
    {
        if (!currentUser)
        {
            showToast("חובה להתחבר כדי להוסיף שמלות למועדפים!", "error");
            return;
        }

        if (isFavorite)
            dispatch(removeFromFavoritesThunk(dressId));
        else
            dispatch(addToFavoritesThunk(dressId));
    };

    // Reviews

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    const renderStars = (rating) =>
    {
        let stars = [];

        for (let i = 0; i < rating; i++)
        {
            stars.push(
                <img
                    key={i}
                    src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874544/star_1_mhurrz.png"
                    className="star-icon"
                    alt="star"
                    style={{ width: "24px", height: "24px", display: "inline-block" }}
                />
            );
        }

        return stars;
    };

    const handleAddReview = (e) =>
    {
        e.preventDefault();

        if (!currentUser)
        {
            showToast("חובה להתחבר כדי להוסיף תגובה!", "error");
            return;
        }

        if (!comment.trim())
            return;

        const newReview =
        {
            dressId: dress._id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            rating: Number(rating),
            comment: comment
        };

        dispatch(addReviewThunk(newReview));

        setComment("");
        setRating(5);
    };

    // react-date-range

    const [rentalRange, setRentalRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        }
    ]);

    // יצירת רשימת תאריכים חסומים לפי מידה

    const disabledDates = useMemo(() =>
    {
        if (!dress?.rentals || !selectedSize)
            return [];

        let blocked = [];

        dress.rentals.filter(rental => rental.size === selectedSize)
            .forEach(rental =>
            {
                let current = new Date(rental.rentDate);
                let end = new Date(rental.returnDate);

                while (current <= end)
                {
                    blocked.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                }
            });
        return blocked;
    }, [dress, selectedSize]);

    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleSaveTempDates = async () =>
    {
        if (!selectedSize)
        {
            showToast("אנא בחרי מידה לפני השריון", "error");
            return;
        }

        const startDate = rentalRange[0].startDate;
        const endDate = rentalRange[0].endDate;

        if (!startDate || !endDate)
        {
            showToast("אנא בחרי טווח תאריכים", "error");
            return;
        }
        const tempRentData =
        {
            dressId,
            size: selectedSize,
            price: dress.price,
            rentDate: format(startDate, "yyyy-MM-dd"),
            returnDate: format(endDate, "yyyy-MM-dd"),
            status: "pending",
            totalAmount: dress.price
        };
        try
        {
            const res = await createRenting(tempRentData);
            if (res && res.rentingId)
            {
                showToast("השמלה שוריינה בהצלחה! נעביר אותך כעת לדף התשלום.", "success");
                navi("/payment",
                {
                    state:
                    {
                        rentingId: res.rentingId,
                        dressId,
                        dressImage: dress.images[0],
                        rentDate: tempRentData.rentDate,
                        returnDate: tempRentData.returnDate,
                        totalAmount: tempRentData.price
                    }
                });
            }
            else
            {
                showToast("השרת לא החזיר מזהה הזמנה תקין.", "error");
            }
        }
        catch(err)
        {
            if (err.response?.status === 401 || err.response?.status === 403)
                setShowAuthModal(true);
            else if (err.response?.status === 409)
                showToast("אופס... התאריכים האלה כבר תפוסים במידה שבחרת.", "error");
            else
                showToast("אופס... התאריך נתפס או שיש שגיאה בתקשורת עם השרת.", "error");
        }
    };

    if (!dress || dress._id !== dressId) {
        return status === "failed"
            ? <p>אופס... שגיאה בטעינת השמלה</p>
            : <p>טוען את פרטי השמלה</p>;
    }

    return (
        <div className="product-container">
            <div className="right-column">
                <div className="slider-container">
                    <div className="thumbnail-strip">
                        {dress.images.map((img, index) => (
                            <img
                                key={index}
                                src={getOptimizedImageUrl(img, 300)}
                                alt={`${dress.name} - ${index + 1}`}
                                className={`thumbnail-img ${index === currentIndex ? "active" : ""}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                    <div className="main-image-wrapper">
                        <button onClick={prevImage}>{">"}</button>
                        <img
                            src={getOptimizedImageUrl(dress.images[currentIndex], 900)}
                            alt={dress.name}
                            className="main-display-image"
                        />
                        <button onClick={nextImage}>{"<"}</button>
                    </div>
                </div>
                <div className="reviews-section">
                    <h3> מה הכלות שלנו אומרות</h3>
                    <form onSubmit={handleAddReview}>
                        <label> בחרי דירוג:</label>
                        <div className="rating-selector">
                            {[1, 2, 3, 4, 5].map(num => (
                                <img key={num} src={rating >= num? "https://res.cloudinary.com/x0um3j7c/image/upload/v1786874544/star_1_mhurrz.png": "https://res.cloudinary.com/x0um3j7c/image/upload/v1786874690/star_3_tctxki.png"}
                                    onClick={() => setRating(num)}
                                    alt={`${num} stars`}/>
                            ))}
                        </div>
                        <textarea
                            placeholder="כתבי לנו את חוות דעתך על השמלה..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit">שלחי תגובה</button>
                    </form>
                    <ul>
                        {dress.reviews?.map((r) => (
                            <li key={r._id}>
                                <p>{r.userName}</p>
                                <span>{renderStars(r.rating)}</span>
                                <p>{r.comment}</p>
                                <small>
                                    {format(new Date(r.createdAt), "dd/MM/yyyy")}
                                </small>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="left-column">
                <h1>{dress.name}</h1>
                <p className="price">₪{dress.price}</p>
                <p className="description">{dress.description}</p>
                <div className="size-and-favorite-row">
                    <div className="sizes-container">
                        {(dress.sizes?.length ? dress.sizes : ["XS", "S", "M", "L", "XL"]).map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                className={
                                    selectedSize === size
                                        ? "selected"
                                        : ""
                                }
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <button
                        className="favorite-btn"
                        onClick={handleFavorite}>
                        <img src={isFavorite? "https://res.cloudinary.com/x0um3j7c/image/upload/v1786874544/heart1_pblekm.png": "https://res.cloudinary.com/x0um3j7c/image/upload/v1786874543/heart2_raapd8.png"} alt="favorite"/>
                    </button>
                </div>
                <hr />
                <h2>SELECT YOUR DATES</h2>
                <div className="date-inputs-container">
                    <div className="date-box">
                        <p>Start Date</p>
                        <span>{format(rentalRange[0].startDate,"dd/MM/yyyy")}</span>
                    </div>
                    <div className="date-box">
                        <p>End Date</p>
                        <span>{format(rentalRange[0].endDate,"dd/MM/yyyy")}</span>
                    </div>
                </div>
                <div className="calendar-wrapper">
                    <DateRange
                        onChange={(item) => setRentalRange([item.selection])}
                        ranges={rentalRange}
                        disabledDates={disabledDates}
                        minDate={new Date()}
                        dayContentRenderer={(date) => {
                            const isReserved = disabledDates.some(d => d.toDateString() === date.toDateString());
                            return (
                                <div className={`day-cell ${isReserved ? 'is-reserved' : ''}`}>
                                    <span>{format(date, "d")}</span>
                                    {/* {isReserved && <div className="reserved-tag">RESERVED</div>} */}
                                </div>
                            );
                        }}
                    />
                </div>
                {!selectedSize &&
                    <p className="warning-msg">
                        * אנא בחרי מידה כדי לבחור תאריכים
                    </p>
                }
                <button
                    className="rent-btn"
                    onClick={handleSaveTempDates}
                    disabled={!selectedSize}
                >
                    השכרה
                </button>

                {isAdmin &&<p>סך הכל השכרות:{" "}{dress.rentals?.length || 0}</p>}
            </div>
            
            {showAuthModal && 
            (
                <div className="auth-modal-overlay">
                    <div className="auth-modal">
                        <h3>התחברי על מנת לשריין תאריכים</h3>
                        <div className="modal-actions">
                            <button onClick={() => navi("/login", { state: { from: location.pathname } })}>עבור להתחברות</button>
                            <button onClick={() => setShowAuthModal(false)}>אישור</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}