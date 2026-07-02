import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logOut } from "../../redux/slices/authSlice";

export function Nav()
{
    const currentUser = useSelector((state) => state.auth.currentUser);
    const isAdmin = currentUser?.userType === "admin";
    const dispatch = useDispatch();
    const navi = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState();

    const handleLogOut = () =>
    {
        localStorage.removeItem("jwtToken");
        dispatch(logOut());
        setIsDropdownOpen(false);
        alert("התנתקת");
        navi("/");
    }

    return(
        <nav>
            <div>
                <ul>
                    {!isAdmin?
                    (
                        <>
                            <div>
                                <li><NavLink to="/">ראשי</NavLink></li>
                                <li><NavLink to="/about">אודותינו</NavLink></li>
                                <li><NavLink to="/collections">קולקציות</NavLink></li>
                                <li><NavLink to="/contact">צרי קשר</NavLink></li>
                            </div>
                            <div>
                                <span onClick={()=> setIsDropdownOpen(!isDropdownOpen)}>אזור אישי</span>
                                {isDropdownOpen &&
                                (
                                    <ul>
                                        <li>
                                            {!currentUser ? (
                                                <NavLink to="/logIn" onClick={() => setIsDropdownOpen(false)}>התחברות</NavLink>
                                            ) : (
                                                <span>התחברות</span>
                                            )}
                                        </li>
                                        <li>
                                            {currentUser ? (
                                                <NavLink to="/myRentings" onClick={() => setIsDropdownOpen(false)}>ההזמנות שלי</NavLink>
                                            ) : (
                                                <span>ההזמנות שלי</span>
                                            )}
                                        </li>
                                        <li>
                                            {currentUser ? (
                                                <span onClick={handleLogOut}>התנתקות</span>
                                            ) : (
                                                <span>התנתקות</span>
                                            )}
                                        </li>  
                                    </ul>
                                )}
                                <li><NavLink to="/favorite">רשימת משאלות</NavLink></li>
                            </div>
                        </>
                    ):
                        <>
                            <div>
                                <li><NavLink to="/admin">לוח בקרה מנהל</NavLink></li>
                                <li><NavLink to="/collections">צפייה בקטלוגים</NavLink></li>
                            </div>
                            <div>
                                <li className="admin-hello">אזור מנהל</li>
                                <li><NavLink to="/logIn" onClick={handleLogOut}>התנתקות</NavLink></li>
                            </div>
                        </>}
                </ul>
            </div>
        </nav>
    )
}