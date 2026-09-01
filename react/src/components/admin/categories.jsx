import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategoryThunk, deleteCategoryThunk, getAllCategoriesThunk, updateCategoryThunk } from '../../redux/slices/categoriesSlice';
import { useToast } from '../presentation/toast';

export function AdminCategories ()
{
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const categories = useSelector((state) => state.categories.categories) || [];
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        dispatch(getAllCategoriesThunk());
    }, [dispatch]);

    const handleAdd = async (e) => 
    {
        e.preventDefault();

        if (!newCategoryName.trim()) return;

        const newCategory =
        {
            name: newCategoryName
        }

        try {
            await dispatch(addCategoryThunk(newCategory)).unwrap();
            setNewCategoryName('');
            showToast("הקטגוריה הוספה בהצלחה", "success");
        }
        catch (err) {
            showToast("שגיאה בהוספת קטגוריה", "error");
        }
    };

    const handleDelete = async (id) => 
    {
        if (!window.confirm("האם את בטוחה שברצונך למחוק קטגוריה זו?")) return;
        
        try
        {
            await dispatch(deleteCategoryThunk(id)).unwrap();
            showToast("הקטגוריה נמחקה בהצלחה", "success");
        }
        catch (err) {
            if (err.response && err.response.status === 400)
                showToast("לא ניתן למחוק קטגוריה שיש בה שמלות!", "error");
            else
                showToast("משהו השתבש, לא ניתן למחוק את הקטגוריה.", "error");
        }
    };

    const [editName, setEditName] = useState("");
    const [editImage, setEditImage] = useState("");

    const handleUpdate = async (id) => 
    {
        const updatedData = {
            name: editName,
            image: editImage
        }
        
        try {
            await dispatch(updateCategoryThunk({ id, categoryData: updatedData })).unwrap();
            showToast("השינויים נשמרו!", "success");
        } catch (err) {
            showToast("שגיאה בעדכון הקטגוריה", "error");
        }
    };

    if (!categories) return <p>טוענת קטגוריות...</p>;

    return (
        <div className="admin-page-container">
            <div className="admin-card">
                <h2>ניהול קטגוריות</h2>
                <div className="add-category-card">
                    <h3>הוספת קטגוריה חדשה</h3>
                    <form onSubmit={handleAdd} className="category-input-group">
                        <input
                            type="text"
                            value={newCategoryName}
                            placeholder="הזיני שם קטגוריה..."
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <button type="submit" className="add-category-btn">הוספה</button>
                    </form>
                </div>

                <div className="admin-table-toolbar">
                    <span className="admin-table-count">{categories.length} קטגוריות</span>
                </div>

                {categories.length === 0 ? (
                    <p className="empty-orders">עדיין אין קטגוריות במערכת</p>
                ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>שם הקטגוריה</th>
                            <th>עדכון שם</th>
                            <th>עדכון תמונה (URL)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td>{cat.name}</td>
                                <td>
                                    <input 
                                        type="text" 
                                        placeholder="שם חדש..." 
                                        onChange={(e) => setEditName(e.target.value)} 
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text" 
                                        placeholder="לינק לתמונה..." 
                                        onChange={(e) => setEditImage(e.target.value)} 
                                    />
                                </td>
                                <td>
                                    <button className="btn-update" onClick={() => handleUpdate(cat._id)}>עדכן</button>
                                    <button className="btn-delete" onClick={() => handleDelete(cat._id)}>מחק</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
};