import { useEffect, useState } from "react";
import { getAllUsers } from "../../API/usersApi";
import { StatusBadge } from "./statusBadge";
import { AdminTableToolbar } from "./adminTableToolbar";
import { useTableSearch } from "../../hooks/useTableSearch";

const matchUser = (u, term) => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    return fullName.includes(term) || (u.email || "").toLowerCase().includes(term);
};

export function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchTerm, setSearchTerm, filtered: filteredUsers } = useTableSearch(users, matchUser);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                // הגנה: אם התשובה מהשרת לא הייתה מערך מסיבה כלשהי, לא
                // רוצים להתרסק בהמשך על .filter/.map
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("שגיאה בטעינת המשתמשים");
            }
            finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-page-container">
            <div className="admin-card">
                <h2>ניהול לקוחות PrimeLace</h2>

                <AdminTableToolbar
                    placeholder="חיפוש לפי שם או אימייל..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    count={filteredUsers.length}
                    countLabel="לקוחות"
                />

                {loading ? (
                    <p>טוענת...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="empty-orders">
                        {searchTerm.trim() ? "לא נמצאו לקוחות התואמים לחיפוש" : "עדיין אין לקוחות רשומים"}
                    </p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>שם הלקוח</th>
                                <th>אימייל ליצירת קשר</th>
                                <th>סטטוס במערכת</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.firstName} {u.lastName}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <StatusBadge positive={u.userType !== "admin"} positiveLabel="לקוח/ה" negativeLabel="מנהל/ת" />
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
