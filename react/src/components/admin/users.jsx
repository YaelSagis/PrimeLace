import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../API/usersApi";

export function AdminUsers() {
    const navi = useNavigate();
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
        <div>            
            <p>צפייה בכל הלקוחות הרשומים ב-primeLace</p>

            {loading ? (
                <p>טוען רשימת משתמשים...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>שם מלא</th>
                            <th>אימייל</th>
                            <th>סוג משתמש</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.userType === 'admin' ? 'מנהל' : 'לקוח'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}