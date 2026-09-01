import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInUserThunk } from "../redux/slices/authSlice";
import { useToast } from "../components/presentation/toast";
import "../styles/signIn.css";

export function SignIn() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();
    const navi = useNavigate();
    const { showToast } = useToast();

    const submit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await dispatch(signInUserThunk({ firstName, lastName, phone, email, password })).unwrap();
            showToast("נרשמת והתחברת בהצלחה!", "success");
            navi("/");
        } catch (err) {
            showToast("שגיאה בהרשמה, אנא נסי שנית", "error");
        } finally {
            setIsSubmitting(false);
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
                    
                    <button type="submit" className="register-btn" disabled={isSubmitting}>
                        {isSubmitting ? "נרשמת..." : "REGISTER"}
                    </button>
                </form>
                
                <p className="login-link">Already have an account? <span onClick={() => navi("/login")}>Log In</span></p>
            </div>
        </div>
    );
}