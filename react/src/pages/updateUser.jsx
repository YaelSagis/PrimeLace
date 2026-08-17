import React, { useState } from 'react';
import { updateUser } from '../API/usersApi';
import "../styles/logIn.css"

export const UpdateUser= () => 
{
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(formData);
            alert("הפרטים עודכנו בהצלחה!");
            navi("/");
        } catch (error) {
            alert("חלה שגיאה בעדכון");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>עדכון פרטים</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="firstName" placeholder="שם פרטי" onChange={handleChange} />
                    <input type="text" name="lastName" placeholder="שם משפחה" onChange={handleChange} />
                    <input type="text" name="phone" placeholder="טלפון" onChange={handleChange} />
                    <input type="password" name="password" placeholder="סיסמה חדשה" onChange={handleChange} />
                    <button type="submit">שמור שינויים</button>
                </form>
            </div>
        </div>
    );
};
