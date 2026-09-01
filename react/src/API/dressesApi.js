import axios from "axios";

const url = import.meta.env.VITE_API_URL || "http://localhost:2000";

export const getAllDresses= async () =>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(`${url}/dresses/getAllDresses`);
        return res.data;
    }
    catch (error)
    {
        console.log("לא ניתן למשוך את השמלות מהשרת");
        throw error;
    }
};

export const getDressById = async (id) =>
{
    try
    {
        const res = await axios.get(`${url}/dresses/getById/${id}`);
        return res.data;
    }
    catch (error) 
    {
        console.log("השמלה לא נמצאה בשרת");
        throw error;
    }
};

export const getPopularDresses = async () =>
{
    try
    {
        const res = await axios.get(`${url}/dresses/popular`);
        return res.data;
    }
    catch (error)
    {
        console.log("לא ניתן למשוך את השמלות הפופולריות מהשרת");
        throw error;
    }
};

export const addDress = async(dress)=>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.post(`${url}/dresses/addDress`, dress,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    }
    catch(error)
    {
        console.log("שגיאה בהוספת השמלה");
        throw error;
    }
};

export const updateDress = async (dress) =>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.put(`${url}/dresses/updateDress/${dress._id}`, dress,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    }
    catch (error) 
    {
        console.log("שגיאה בעדכון השמלה");
        throw error;
    }
}

export const deleteDress = async (id) => 
{
    try 
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.delete(`${url}/dresses/deleteDress/${id}`,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return id;
    } 
    catch (error) 
    {
        console.log("שגיאה במחיקת השמלה");
        throw error;
    }
};

export const addReview = async (review) => 
{
    try 
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.post(`${url}/dresses/addReview`, review,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } 
    catch (error) 
    {
        console.log("שגיאה בהוספת תגובה");
        throw error;
    }
};

//AI-העלאה ל-Cloudinary 
export const uploadImagesToCloudinary = async (files) => {
        const urls = [];
        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "dresses_preset"); // השם שהגדרת ב-Settings

            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/x0um3j7c/image/upload", // ה-Cloud Name שלך
                formData
            );
            urls.push(res.data.secure_url);
        }
        return urls; // זה המערך עם כל הלינקים
    };

