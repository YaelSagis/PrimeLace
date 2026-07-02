import axios from "axios";

const url=`http://localhost:2000`;

export const getMeUser = async ()=>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        if(!token)
            return null;
        const res = await axios.get(`${url}/users/getMe`,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    }
    catch(error)
    {
        console.log("המשתמש אינו מחובר");
        throw error;
    }
}

export const logInUser = async (emailPassword)=>
{
    try
    {
        const res = await axios.post(`${url}/users/logInUser`, emailPassword);
        return res.data;
    }
    catch(error)
    {
        console.log("שגיאת התחברות");
        throw error;
    }
};

export const signInUser = async (user)=>
{
    try
    {
        const res = await axios.post(`${url}/users/addUser`, user);
        return res.data;
    }
    catch(error)
    {
        console.log("שגיאת הרשמה");
        throw error;
    }
};

export const getAllUsers = async ()=>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(`${url}/users/getAllUsers`,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    }
    catch(error)
    {
        console.log("שגיאה בשליפת משתמשים");
        throw error;
    }
};

export const updateUser = async (user)=>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.put(`${url}/users/updateUser`, user,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    }
    catch(error)
    {
        console.log("שגיאה בעדכון משתמש");
        throw error;
    }
};

export const addToFavorites = async (dressId)=>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.post(`${url}/users/addToFavorites`, dressId,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    }
    catch(error)
    {
        console.log("שגיאה בהוספת מועדף");
        throw error;
    }
};

export const removeFromFavorites = async (dressId)=>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.post(`${url}/users/removeFromFavorites`, dressId,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    }
    catch(error)
    {
        console.log("שגיאה במחיקת מועדף");
        throw error;
    }
};

export const getMyFavorites = async ()=>
{
    try
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(`${url}/users/getMyFavorites`,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    }
    catch(error)
    {
        console.log("שגיאה בשליפת מועדפים");
        throw error;
    }
};