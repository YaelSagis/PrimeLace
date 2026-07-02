import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInUserThunk } from "../redux/slices/authSlice";

export function SignIn()
{
    const [firstName, setFirstName]=useState("");
    const [lastName, setLastName]=useState("");
    const [phone, setPhone]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");

    const dispatch = useDispatch();
    const navi = useNavigate();

    const authStatus = useSelector((state) => state.auth.status);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => 
    {
        if(isAuthenticated)
        {
            alert("נרשמת והתחברת בהצלחה!");
            navi("/");
        }
        if (authStatus === 'failed')
        {
            alert("שגיאה בהרשמה, אנא נסי שנית");
        }
    }, [isAuthenticated, authStatus, navi]);

    const submit = async (e)=>
    {
        e.preventDefault();

        const newUser=
        {
            firstName,
            lastName,
            phone,
            email,
            password
        };

        dispatch(signInUserThunk(newUser));
    }

    return(
        <>
        <div>
            <form onSubmit={submit}>
                <input type="text" placeholder="שם" value={firstName} onChange={e => setFirstName(e.target.value)} required></input>
                <input type="text" placeholder="משפחה" value={lastName} onChange={e => setLastName(e.target.value)} required></input>
                <input type="text" placeholder="טלפון" value={phone} onChange={e => setPhone(e.target.value)} required></input>
                <input type="email" placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)} required></input>
                <input type="password" placeholder="סיסמה" value={password} onChange={e => setPassword(e.target.value)} required></input>
                <button type="submit" disabled={authStatus === 'loading'}>{authStatus === 'loading' ? "טוען ..." : "הרשמי"}</button>
            </form>
        </div>
        </>
    )
}
