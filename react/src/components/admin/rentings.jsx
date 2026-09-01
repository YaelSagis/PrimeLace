import { useEffect, useState } from "react";
import { getAllRentings } from "../../API/rentingsApi";
import { formatDate } from "../../utils/format";
import { StatusBadge } from "./statusBadge";
import { AdminTableToolbar } from "./adminTableToolbar";
import { useTableSearch } from "../../hooks/useTableSearch";

const matchRenting = (r, term) => {
    const userName = r.userId ? `${r.userId.firstName || ""} ${r.userId.lastName || ""}` : "";
    const dressName = r.dressId ? r.dressId.name || "" : "";
    return userName.toLowerCase().includes(term) || dressName.toLowerCase().includes(term);
};

export function AdminRentings() {
    const [rentings, setRentings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchTerm, setSearchTerm, filtered: filteredRentings } = useTableSearch(rentings, matchRenting);

    useEffect(() => {
        const fetchRentings = async () => {
            try {
                const data = await getAllRentings();
                setRentings(Array.isArray(data) ? data : []);
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

                <AdminTableToolbar
                    placeholder="חיפוש לפי לקוחה או שמלה..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    count={filteredRentings.length}
                    countLabel="הזמנות"
                />

                {loading ? (
                    <p>טוענת נתונים...</p>
                ) : filteredRentings.length === 0 ? (
                    <p className="empty-orders">
                        {searchTerm.trim() ? "לא נמצאו הזמנות התואמות לחיפוש" : "עדיין אין הזמנות במערכת"}
                    </p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>לקוחה</th>
                                <th>שמלה</th>
                                <th>מידה</th>
                                <th>תאריך</th>
                                <th>סכום</th>
                                <th>סטטוס</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRentings.map((r) => (
                                <tr key={r._id}>
                                    <td>{r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : "לקוחה"}</td>
                                    <td>{r.dressId ? r.dressId.name : "שמלה"}</td>
                                    <td>{r.size || "—"}</td>
                                    <td>{formatDate(r.createdAt || r.rentDate)}</td>
                                    <td>₪{(Number(r.totalAmount) || 0).toLocaleString()}</td>
                                    <td>
                                        <StatusBadge positive={r.status === "paid"} positiveLabel="שולם" negativeLabel="ממתין לתשלום" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
