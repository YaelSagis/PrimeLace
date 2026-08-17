import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInUserThunk } from "../redux/slices/authSlice";
import "../styles/signIn.css";

export function SignIn() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navi = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(signInUserThunk({ firstName, lastName, phone, email, password })).unwrap();
            alert("נרשמת והתחברת בהצלחה!");
            navi("/");
        } catch (err) {
            alert("שגיאה בהרשמה, אנא נסי שנית");
        }
    };

    return (
        <div className="signin-page-wrapper">
            <div className="signin-card">
                <h2>CREATE YOUR ACCOUNT</h2>
                <p className="subtitle">Join our community to save your favorite gowns and connect with other brides.</p>
                
                <form onSubmit={submit} className="signin-form">
                    <input type="text" placeholder="שם פרטי" value={firstName} onChange={e => setFirstName(e.target.value)} required className="auth-input" />
                    <input type="text" placeholder="שם משפחה" value={lastName} onChange={e => setLastName(e.target.value)} required className="auth-input" />
                    <input type="text" placeholder="טלפון" value={phone} onChange={e => setPhone(e.target.value)} required className="auth-input" />
                    <input type="email" placeholder="דואר אלקטרוני" value={email} onChange={e => setEmail(e.target.value)} required className="auth-input" />
                    <input type="password" placeholder="סיסמה" value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" />
                    
                    <button type="submit" className="register-btn">REGISTER</button>
                </form>
                
                <p className="login-link">Already have an account? <span onClick={() => navi("/login")}>Log In</span></p>
            </div>
        </div>
    );
}