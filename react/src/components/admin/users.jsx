import { useEffect, useState } from "react";
import { getAllUsers } from "../../API/usersApi";

export function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
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
                {loading ? <p>טוען...</p> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>שם הלקוח</th>
                                <th>אימייל ליצירת קשר</th>
                                <th>סטטוס במערכת</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.firstName} {u.lastName}</td>
                                    <td>{u.email}</td>
                                    <td>{u.userType === 'admin' ?' מנהל' : 'לקוח'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}