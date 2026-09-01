import axios from "axios";

const url = import.meta.env.VITE_API_URL || "http://localhost:2000";

export const getAllCategories= async () =>
{
    try
    {
        const res = await axios.get(`${url}/categories/getAllCategories`);
        return res.data;
    }
    catch (error)
    {
        console.log("לא ניתן למשוך את הקטגוריות מהשרת");
        throw error;
    }
};

export const getLatestCategory = async () =>
{
    try
    {
        const res = await axios.get(`${url}/categories/latest`);
        return res.data;
    }
    catch (error)
    {
        console.log("לא ניתן למשוך את הקטגוריה האחרונה מהשרת");
        throw error;
    }
};

export const getDressesByCategory= async (id) =>
{
    try
    {
        console.log("React פונה לכתובת המלאה המוגדרת הבאה:", `${url}/categories/getDressesByCategory/${id}`);
        const res = await axios.get(`${url}/categories/getDressesByCategory/${id}`,
        );
        return res.data;
    }
    catch (error)
    {
        console.log("השמלות לא נמצאות בשרת");
        throw error;
    }
};

export const addCategory = async (category) => 
{
    try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.post(`${url}/categories/addCategory`, category, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } 
    catch (error) 
    {
        console.log("שגיאה בהוספת קטגוריה");
        throw error;
    }
};

export const updateCategory = async (id, categoryData) =>
{
    try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.put(`${url}/categories/updateCategory/${id}`, categoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } 
    catch (error) 
    {
        console.log("שגיאה בעדכון הקטגוריה");
        throw error;
    }
};

export const deleteCategory = async (id) => 
{
    try {
        const token = localStorage.getItem("jwtToken");
        await axios.delete(`${url}/categories/deleteCategory/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return id;
    } 
    catch (error)
    {
        console.log("שגיאה במחיקת הקטגוריה");
        throw error;
    }
};
