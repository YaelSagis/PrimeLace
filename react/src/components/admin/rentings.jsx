import { useEffect, useState } from "react";
import { getAllRentings } from "../../API/rentingsApi";

export function AdminRentings() {
    const [rentings, setRentings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentings = async () => {
            try {
                const data = await getAllRentings();
                setRentings(data);
            } catch (error) {
                console.error("שגיאה בטעינת ההשכרות", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRentings();
    }, []);

    return (
        <div className="admin-page-container">
            <div className="admin-card">
                <h2>ניהול הזמנות</h2>
                {loading ? <p>טוען נתונים...</p> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>לקוחה</th>
                                <th>שמלה</th>
                                <th>מידה</th>
                                <th>סכום</th>
                                <th>סטטוס</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentings.map((r) => (
                                <tr key={r._id}>
                                    <td>{r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : "לקוחה"}</td>
                                    <td>{r.dressId ? r.dressId.name : "שמלה"}</td>
                                    <td>{r.size}</td>
                                    <td>₪{r.totalAmount}</td>
                                    <td>{r.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}