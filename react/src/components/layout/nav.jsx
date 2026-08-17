import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logOut } from "../../redux/slices/authSlice";
import "../../styles/layout.css";

export function Nav() {
    const currentUser = useSelector((state) => state.auth.currentUser);
    const isAdmin = currentUser?.userType === "admin";
    const dispatch = useDispatch();
    const navi = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogOut = () => {
        dispatch(logOut());
        setIsDropdownOpen(false);
        alert("התנתקת בהצלחה");
        navi("/");
    };

    return (
        <nav className="nav-container">
            {isAdmin && (
                <div className="admin-badge">
                    מחובר כעת במצב מנהל מערכת
                </div>
            )}

            <ul>
                <li><NavLink to="/">ראשי</NavLink></li>
                <li><NavLink to="/about">אודותינו</NavLink></li>
                <li><NavLink to="/collections">קולקציות</NavLink></li>
                <li><NavLink to="/contact">צרי קשר</NavLink></li>
                <li><NavLink to="/signIn">הרשמה</NavLink></li>
                <li><NavLink to="/favorites">רשימת משאלות</NavLink></li>

                <li className="dropdown-wrapper">
                    <span onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="nav-link-style">
                        אזור אישי ▾
                    </span>

                    {isDropdownOpen && (
                        <>
                            <div 
                                style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 90}} 
                                onClick={() => setIsDropdownOpen(false)}
                            ></div>

                            <ul className="dropdown-menu" style={{zIndex: 100}}>
                                {!currentUser ? (
                                    <li><NavLink to="/login" onClick={() => setIsDropdownOpen(false)}>התחברות</NavLink></li>
                                ) : (
                                    <>
                                        <li className="user-greeting">שלום, {currentUser.firstName || "אורח"}</li>
                                        <li><NavLink to="/my-rentals" onClick={() => setIsDropdownOpen(false)}>ההזמנות שלי</NavLink></li>
                                        <li><NavLink to="/updateUser" onClick={() => setIsDropdownOpen(false)}>עדכון משתמש</NavLink></li>
                                        <li><span onClick={handleLogOut} className="logout-btn">התנתקות</span></li>
                                    </>
                                )}
                            </ul>
                        </>
                    )}
                </li>
            </ul>
        </nav>
    );
}