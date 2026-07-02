import { useNavigate } from "react-router-dom"

export function Home()
{
    const navi = useNavigate();

    return(
        <div className="homepage">
                <h1>Welcome to primeLace</h1>
                <h2>מקום שבו חלומות נרקמים לתחרה</h2>
                <p>מצאי את שמלת הכלה המושלמת שלך מתוך הקולקציות הבלעדיות שלנו</p>
                <button className="explore-btn" onClick={() => navi("/collections")}>
                    כניסה לקטלוג הקולקציות ➔
                </button>
        </div>
    )
}
