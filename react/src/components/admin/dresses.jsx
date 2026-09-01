import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDressThunk, deleteDressThunk, getAllDressesThunk } from "../../redux/slices/dressesSlice";
import { getAllCategoriesThunk } from "../../redux/slices/categoriesSlice";
import { uploadImagesToCloudinary } from "../../API/dressesApi";
import { useToast } from "../presentation/toast";
import { StatusBadge } from "./statusBadge";
import { AdminTableToolbar } from "./adminTableToolbar";
import { useTableSearch } from "../../hooks/useTableSearch";

const matchDress = (d, term) => (d.name || "").toLowerCase().includes(term);

export function AdminDresses() {
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const dresses = useSelector((state) => state.dresses.dresses) || [];
    const dressesStatus = useSelector((state) => state.dresses.status);
    const categories = useSelector((state) => state.categories.categories) || [];

    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { searchTerm, setSearchTerm, filtered: filteredDresses } = useTableSearch(dresses, matchDress);

    useEffect(() => {
        dispatch(getAllDressesThunk());
        dispatch(getAllCategoriesThunk());
    }, [dispatch]);

    const categoryNameFor = (dress) => {
        if (dress.category && typeof dress.category === "object") {
            return dress.category.name || "—";
        }
        return categories.find((c) => c._id === dress.category)?.name || "—";
    };

    const handleAddDress = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            showToast("יש לבחור קטגוריה לשמלה", "error");
            return;
        }
        if (selectedFiles.length === 0) {
            showToast("יש להעלות לפחות תמונה אחת", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const uploadedUrls = await uploadImagesToCloudinary(selectedFiles);

            const newDress = {
                name,
                color,
                price: Number(price),
                images: uploadedUrls,
                category: categoryId
            };

            await dispatch(addDressThunk(newDress)).unwrap();
            showToast("השמלה נוספה בהצלחה", "success");

            setName("");
            setColor("");
            setPrice("");
            setCategoryId("");
            setSelectedFiles([]);
        }
        catch (err) {
            showToast("שגיאה בהוספת השמלה", "error");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDress = async (id) => {
        if (!window.confirm("האם את בטוחה שברצונך למחוק שמלה זו?")) return;

        try {
            await dispatch(deleteDressThunk(id)).unwrap();
            showToast("השמלה נמחקה בהצלחה", "success");
        }
        catch (err) {
            showToast("שגיאה במחיקת השמלה", "error");
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-card">
                <h2>ניהול שמלות</h2>

                <div className="add-category-card">
                    <h3>הוספת שמלה חדשה</h3>
                    <form onSubmit={handleAddDress} className="admin-form">
                        <div className="form-group">
                            <label>שם השמלה</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>קטגוריה</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">בחרי קטגוריה...</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>צבע</label>
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>מחיר השכרה</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
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
                                    <span>
                                        {selectedFiles.length > 0
                                            ? `נבחרו ${selectedFiles.length} תמונות`
                                            : "לחצי להעלאת תמונות מהמחשב"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? "מוסיפה..." : "הוסף שמלה"}
                        </button>
                    </form>
                </div>

                <AdminTableToolbar
                    placeholder="חיפוש שמלה לפי שם..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    count={filteredDresses.length}
                    countLabel="שמלות"
                />

                {dressesStatus === "loading" ? (
                    <p>טוענת שמלות...</p>
                ) : filteredDresses.length === 0 ? (
                    <p className="empty-orders">
                        {searchTerm.trim() ? "לא נמצאו שמלות התואמות לחיפוש" : "עדיין אין שמלות במערכת"}
                    </p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>שמלה</th>
                                <th>קטגוריה</th>
                                <th>צבע</th>
                                <th>מחיר</th>
                                <th>סטטוס</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDresses.map((d) => (
                                <tr key={d._id}>
                                    <td>
                                        <div className="dress-cell">
                                            {d.images?.[0] && (
                                                <img src={d.images[0]} alt={d.name} className="dress-thumb" />
                                            )}
                                            <span>{d.name}</span>
                                        </div>
                                    </td>
                                    <td>{categoryNameFor(d)}</td>
                                    <td>{d.color || "—"}</td>
                                    <td>₪{d.price}</td>
                                    <td>
                                        <StatusBadge positive={d.status === "available"} positiveLabel="זמינה" negativeLabel="מושכרת" />
                                    </td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleDeleteDress(d._id)}>
                                            מחק
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}