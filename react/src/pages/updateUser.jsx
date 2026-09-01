import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../API/usersApi';
import { loadUserThunk } from '../redux/slices/authSlice';
import { useToast } from '../components/presentation/toast';
import "../styles/logIn.css"

export const UpdateUser = () =>
{
    const currentUser = useSelector((state) => state.auth.currentUser);
    const dispatch = useDispatch();
    const navi = useNavigate();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        firstName: currentUser?.firstName || "",
        lastName: currentUser?.lastName || "",
        phone: currentUser?.phone || "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const dataToSend = { ...formData };
            if (!dataToSend.password) {
                delete dataToSend.password; // לא שולחים סיסמה ריקה - כלומר "לא לשנות"
            }

            await updateUser(dataToSend);
            await dispatch(loadUserThunk()); // מרעננים את פרטי המשתמש בריידקס
            showToast("הפרטים עודכנו בהצלחה!", "success");
            navi("/");
        } catch (error) {
            showToast("חלה שגיאה בעדכון הפרטים", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>עדכון פרטים</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="שם פרטי"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="שם משפחה"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="טלפון"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="סיסמה חדשה (השאירי ריק כדי לא לשנות)"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "שומר..." : "שמור שינויים"}
                    </button>
                </form>
            </div>
        </div>
    );
};
