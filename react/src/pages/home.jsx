import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

export function Home()
{
    const navi = useNavigate();

    const currentUser = useSelector((state) => state.auth?.user);
    const isAdmin = currentUser && currentUser.userType === 'admin';

    const handleNavigateToUsers = () =>
    {
        navi("/admin/users");
    }

    const handleNavigateToRentings = () =>
    {
        navi("/admin/rentings");
    }

    return(
        <div className="homepage">

            {isAdmin && (
                <div>
                    <h3>סרגל ניהול</h3>
                    <button onClick={handleNavigateToUsers}>ניהול משתמשים </button>
                    <button onClick={handleNavigateToRentings}>ניהול השכרות</button>
                    <hr />
                </div>
            )}

            <h1>Welcome to primeLace</h1>
            <h2>מקום שבו חלומות נרקמים לתחרה</h2>
            <p>מצאי את שמלת הכלה המושלמת שלך מתוך הקולקציות הבלעדיות שלנו</p>
            <button className="explore-btn" onClick={() => navi("/collections")}>
                כניסה לקטלוג הקולקציות ➔
            </button>
        </div>
    )
}
