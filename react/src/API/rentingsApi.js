import axios from 'axios';

const url=`http://localhost:2000`;

export const getMyRentings = async () => 
{
    try 
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(`${url}/rentings`,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } 
    catch (error) 
    {
        console.log("שגיאה במשיכת ההזמנות מהשרת");
        throw error;
    }
};

export const getAllRentings = async () => 
{
    try 
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(`${url}/rentings/getAllRentings`,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } 
    catch (error) 
    {
        console.log("שגיאה במשיכת ההזמנות מהשרת");
        throw error;
    }
};

export const createRenting = async (renting) => 
{
    try 
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.post(`${url}/rentings/addRenting`, renting,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } 
    catch (error) 
    {
        console.log("ההזמנה נכשלה");
        throw error;
    }
};

export const cancelRenting = async (id) => 
{
    try 
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.delete(`${url}/rentings/deleteRenting/${id}`,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } 
    catch (error) 
    {
        console.log("לא ניתן לבטל את ההזמנה בשרת");
        throw error;
    }
};

export const updateRenting = async (id) => 
{
    try 
    {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.put(`${url}/rentings/updateRenting/${id}`, {}, 
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } 
    catch (error) 
    {
        console.log("לא ניתן לעדכן את ההזמנה בשרת");
        throw error;
    }
};