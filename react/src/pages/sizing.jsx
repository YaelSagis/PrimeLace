import "../styles/sizing.css";

const SIZE_CHART = [
    { size: "XS", bust: "78-82", waist: "60-64", hips: "86-90" },
    { size: "S", bust: "83-87", waist: "65-69", hips: "91-95" },
    { size: "M", bust: "88-93", waist: "70-75", hips: "96-101" },
    { size: "L", bust: "94-99", waist: "76-81", hips: "102-107" },
    { size: "XL", bust: "100-106", waist: "82-88", hips: "108-114" },
];

export function Sizing() {
    return (
        <div className="sizing-page">
            <div className="sizing-header">
                <h1>מדריך המידות שלנו</h1>
                <p className="subtitle">כדי שתמצאי את ההתאמה המושלמת ליום המיוחד שלך</p>
            </div>

            <div className="sizing-table-wrapper">
                <table className="sizing-table">
                    <thead>
                        <tr>
                            <th>מידה</th>
                            <th>היקף חזה (ס"מ)</th>
                            <th>היקף מותניים (ס"מ)</th>
                            <th>היקף ירכיים (ס"מ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SIZE_CHART.map((row) => (
                            <tr key={row.size}>
                                <td className="sizing-size-cell">{row.size}</td>
                                <td>{row.bust}</td>
                                <td>{row.waist}</td>
                                <td>{row.hips}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="sizing-note">
                    * המידות בטבלה הן הערכה כללית ועשויות להשתנות מעט בין דגם לדגם.
                </p>
            </div>

            <div className="sizing-info-grid">
                <div className="sizing-info-item">
                    <h3>איך למדוד נכון</h3>
                    <p>
                        היקף חזה - מודדים בנקודה הרחבה ביותר. היקף מותניים - בנקודה
                        הצרה ביותר, בדרך כלל מעל הטבור. היקף ירכיים - בנקודה הרחבה
                        ביותר של הישבן.
                    </p>
                </div>
                <div className="sizing-info-item">
                    <h3>התאמה אישית בסלון</h3>
                    <p>
                        כל שמלה אצלנו עוברת בדיקת התאמה אישית לפני מסירתה - אם המידה
                        אינה מדויקת במאה אחוז, נבצע התאמות קלות כדי שהשמלה תשב עלייך
                        בצורה מושלמת.
                    </p>
                </div>
                <div className="sizing-info-item">
                    <h3>לא בטוחה איזו מידה?</h3>
                    <p>
                        אתן מוזמנות ליצור איתנו קשר או להגיע לסטודיו למדידה אישית
                        לפני שריון התאריכים - נשמח ללוות אתכן בבחירה הנכונה.
                    </p>
                </div>
            </div>
        </div>
    );
}
