import { useState } from "react";
import { useDispatch } from "react-redux";
import { logInUserThunk } from "../redux/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/logIn.css"

export function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navi = useNavigate();
    const location = useLocation();

    const submitLogIn = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await dispatch(logInUserThunk({ email, password })).unwrap();
            navi(location.state?.from || "/");
        } catch (err) {
            setError("פרטי ההתחברות שגויים.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>התחברות לחשבון שלך</h2>
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => navi("/signIn")}>מעבר להרשמה</button>
                    </div>
                )}
                <form onSubmit={submitLogIn}>
                    <input 
                        type="email" 
                        placeholder="אימייל" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className={error ? "input-error" : ""}
                    />
                    <input 
                        type="password" 
                        placeholder="סיסמה" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className={error ? "input-error" : ""}
                    />
                    <button type="submit">התחברי</button>
                </form>
            </div>
        </div>
    );
}