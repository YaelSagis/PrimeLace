import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategoryThunk, deleteCategoryThunk, getAllCategoriesThunk, updateCategoryThunk } from '../../redux/slices/categoriesSlice';

export function AdminCategories () 
{
    const dispatch = useDispatch();
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
            alert("הקטגוריה הוספה בהצלחה");
        } 
        catch (err) {
            alert("שגיאה בהוספת קטגוריה");
        }
    };

    const handleDelete = async (id) => 
    {
        if (!window.confirm("האם את בטוחה שברצונך למחוק קטגוריה זו?")) return;
        
        try 
        {
            await dispatch(deleteCategoryThunk(id)).unwrap;
            alert("הקטגוריה נמחקה בהצלחה");
        } 
        catch (err) {
            if (err.response && err.response.status === 400) 
                alert("לא ניתן למחוק קטגוריה שיש בה שמלות!");
            else
                alert("משהו השתבש, לא ניתן למחוק את הקטגוריה.");
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
        
        await dispatch(updateCategoryThunk({ id, categoryData: updatedData })).unwrap();
        alert("השינויים נשמרו!");
    };

    if (!categories) return <p>טוען קטגוריות...</p>;

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
            </div>
        </div>
    );
};
