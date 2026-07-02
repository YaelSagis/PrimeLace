import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { logInUserThunk } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export function LogIn()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navi = useNavigate();

    const authStatus = useSelector((state)=> {return state.auth.status});
    const isAuthenticated = useSelector((state) => {return state.auth.isAuthenticated});

    useEffect(() =>
    {
        if(isAuthenticated)
        {
            alert("ברוכה הבאה! התחברת בהצלחה");
            navi("/");
        }
        if(authStatus === "failed")
        {
            alert("פרטי ההתחברות שגויים, אנא נסי שנית");
        }
    }, [isAuthenticated, authStatus, navi]);

    const submitLogIn = (e)=>
    {
        e.preventDefault();

        dispatch(logInUserThunk({email, password}));      
    };

    return (
        <div>
            <h2>התחברות לחשבון שלך</h2>
            <form onSubmit={submitLogIn}>
                <div>
                    <input 
                        type="email" 
                        placeholder="אימייל" 
                        value={email} 
                        onChange={(e) => { setEmail(e.target.value); }} 
                        required 
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="סיסמה" 
                        value={password} 
                        onChange={(e) => { setPassword(e.target.value); }} 
                        required 
                    />
                </div>           
                <button type="submit" disabled={authStatus === 'loading'}>התחברי</button>
            </form>
        </div>
    );
}