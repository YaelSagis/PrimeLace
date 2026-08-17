import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/protected.css"; 

export function ProtectedRoute({ children, adminOnly = false}) {
    const navi = useNavigate();

    const currentUser = useSelector((state) => state.auth.currentUser);
    const authStatus = useSelector((state) => state.auth.status);

    if (authStatus === 'loading')
    {
        return <div>טוען נתונים...</div>;
    }

    if (!currentUser) {
        return (
            <div className="auth-modal">
                <div className="modal-content">
                    <h3>כדי לצפות בעמוד זה, עלייך להתחבר למערכת</h3>
                    <div className="modal-actions">
                        <button onClick={() => navi('/login')}>למעבר להתחברות</button>
                        <button onClick={() => navi('/')}>חזרה לדף הבית</button>
                    </div>
                </div>
            </div>
        );
    }

    if (adminOnly && currentUser.userType !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}