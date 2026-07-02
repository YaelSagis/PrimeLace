import axios from "axios";

const url=`http://localhost:2000`;

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

export const getDressesByCategory= async (id) =>
{
    try
    {
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