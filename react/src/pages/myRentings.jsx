import { useNavigate } from "react-router-dom";

export function MyRentings()
{
    const navi = useNavigate();

    const currentUser = useSelector((state) => state.auth.user); 

    const [rentings, setRentings] = useState([]);
    const [status, setStatus] = useState("idle");

    useEffect(() => 
    {
        if (!currentUser)
        {
            navi("/login");
        }

        const fetchRentings = async () =>
        {
            setStatus("loading");
            try {
                const data = await getMyRentings();
                setRentings(data);
                setStatus("succeeded");
            } catch (error) {
                setStatus("failed");
            }
        };

        fetchRentings();
    }, [currentUser, navi]);

    return (
        <>
            <h1>ההשכרות שלי</h1>

            {status === "loading" || status === "idle" ? (
                <p>טוען השכרות...</p>
            ) : status === "failed" ? (
                <p>שגיאה בטעינת ההשכרות</p>
            ) : status === "succeeded" ? (
                rentings.length === 0 ? (
                    <p>לא נמצאו השכרות קודמות במערכת</p>
                ) : (
                    <div>
                        {rentings.map((r) => (
                            <div key={r._id}>
                                <h3>השכרה מספר: {r._id}</h3>
                                <p>קוד שמלה: {r.dressId}</p>
                                <p>מחיר השכרה: ₪{r.price}</p>
                                <p>תאריך קבלה: {new Date(r.rentDate).toLocaleDateString()}</p>
                                <p>תאריך החזרה מתוכנן: {new Date(r.returnDate).toLocaleDateString()}</p>
                                
                                {r.ActualReturnDate && (
                                    <p>תאריך החזרה בפועל: {new Date(r.ActualReturnDate).toLocaleDateString()}</p>
                                )}
                                
                                <p>סטטוס: {r.status}</p>
                                <p>סה"כ לתשלום: ₪{r.totalAmount}</p>
                                <p>תאריך יצירת ההשכרה: {new Date(r.createdAt).toLocaleDateString()}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                )
            ) : null}
        </>
    );
}