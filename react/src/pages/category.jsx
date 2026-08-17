import { useDispatch, useSelector } from "react-redux";
import { DressCard } from "../components/presentation/dressCard";
import { useEffect, useState } from "react";
import { addDressThunk, deleteDressThunk, getDressesByCategoryThunk } from "../redux/slices/dressesSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/category.css";
import { uploadImagesToCloudinary } from "../API/dressesApi";

export function Category()
{
    const {categoryId} = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navi = useNavigate();
    
    const categoryName = location.state?.categoryName ||
    categories.find((c) => c._id === categoryId)?.name;
    const dresses = useSelector((state) => state.dresses.dresses);
    const status = useSelector((state) => state.dresses.dressStatus);

    const currentUser = useSelector((state) => state.auth?.currentUser);
    const isAdmin = currentUser && currentUser.userType === 'admin';

    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState("");

    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(()=>
    {
        if(categoryId)
            dispatch(getDressesByCategoryThunk(categoryId));
    },[categoryId, dispatch]);

    const handleAddDress = async (e)=>
    {
        e.preventDefault();

        const uploadedUrls = await uploadImagesToCloudinary(selectedFiles)

        const newDress = {
            name,
            color,
            price: Number(price),
            images: uploadedUrls,
            category: categoryId
        };

        dispatch(addDressThunk(newDress));
        
        setName("");
        setColor("");
        setPrice("");
        setSelectedFiles([])
    }

    const handleDeleteDress = (id) =>
    {
        dispatch(deleteDressThunk(id));
    }

    return (
        <div className="category-page-container">
            <h1 className="category-title">{categoryName}</h1>
            {isAdmin && (
                <div className="admin-card">
                    <h3>הוספת שמלה חדשה לקטגוריה</h3>
                    <form onSubmit={handleAddDress} className="admin-form">
                        <div className="form-group">
                            <label>שם השמלה</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>צבע</label>
                            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>מחיר השכרה</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>תמונות השמלה</label>
                            <div className="file-upload-wrapper">
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))} 
                                />
                                <div className="file-upload-design">
                                    <span className="upload-icon">✦</span>
                                    <span>{selectedFiles.length > 0 ? `נבחרו ${selectedFiles.length} תמונות` : "לחצי להעלאת תמונות מהמחשב"}</span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn-submit">הוסף שמלה</button>
                    </form>
                </div>
            )}

            {status === 'loading' ? (
                <div className="status-message loading">טוען שמלות...</div>
            ) : status === 'failed' ? (
                <div className="status-message error">שגיאה בטעינת השמלות</div>
            ) : dresses && dresses.length === 0 ? (
                <div className="status-message empty">אין עדיין שמלות בקטגוריה זו</div>
            ) : (
                <div className="dresses-grid">
                    {dresses.map((d) => (
                        <div key={d._id} className="dress-item-wrapper">
                            <DressCard dress={d} func={(id) => navi(`/product/${id}`)} />
                            {isAdmin && (
                                <button className="delete-btn" onClick={() => handleDeleteDress(d._id)}>
                                    מחק שמלה
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}