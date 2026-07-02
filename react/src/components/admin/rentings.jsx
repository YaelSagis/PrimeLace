import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRentings } from "../../API/rentingsApi";

export function AdminRentings() {
    const navi = useNavigate();
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
        <div>
            
            <p>מעקב אחר כל שמלות הכלה שהושכרו</p>

            {loading ? (
                <p>טוען רשימת השכרות...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>מספר הזמנה</th>
                            <th>קוד לקוח</th>
                            <th>קוד שמלה</th>
                            <th>סכום כולל</th>
                            <th>סטטוס</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentings.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.userId}</td>
                                <td>{order.dressId}</td>
                                <td>₪{order.totalAmount}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}