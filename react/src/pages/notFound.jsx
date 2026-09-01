import { useNavigate } from "react-router-dom";
import "../styles/notFound.css";

export function NotFound() {
    const navi = useNavigate();

    return (
        <div className="notfound-page">
            <div className="notfound-card">
                <span className="notfound-code">404</span>
                <div className="notfound-divider"></div>
                <h1>העמוד שחיפשת לא נמצא</h1>
                <p>
                    ייתכן שהקישור שגוי או שהעמוד הוסר. אפשר תמיד לחזור לקטלוג
                    השמלות ולהמשיך לחפש את השמלה המושלמת.
                </p>
                <div className="notfound-actions">
                    <button className="notfound-btn primary" onClick={() => navi("/")}>
                        לעמוד הבית
                    </button>
                    <button className="notfound-btn" onClick={() => navi("/collections")}>
                        לקולקציות
                    </button>
                </div>
            </div>
        </div>
    );
}
