import {NavLink} from "react-router-dom";

export function Footer()
{

    return(
        <>
        <div className="right">
        </div>
        <footer dir="rtl">
            <div>
                <nav>
                    <h3>הסלון שלנו</h3>
                    <ul>
                        <li><NavLink to="/about">אודותינו</NavLink></li>
                        <li><NavLink to="/contact">צרי קשר</NavLink></li>
                        <li><NavLink to="/appointment">תיאום פגישה</NavLink></li>
                    </ul>
                </nav>
                <nav>
                    <h3>השכרה</h3>
                    <ul>
                        <li><NavLink to="/collections">דפדוף בקטלוגים</NavLink></li>
                        <li><NavLink to="/sizing">מידות</NavLink></li>
                    </ul>
                </nav>
                {/*<nav>
                    <h3>תמיכת לקוחות</h3>
                    <ul>
                        <li><NavLink to="/my-account">החשבון שלי</NavLink></li>
                        <li><NavLink to="/order-tracking">מעקב הזמנה</NavLink></li>
                        <li><NavLink to="/terms">תנאים והגבלות</NavLink></li>
                    </ul>
                </nav>*/}
                <div>
                    <h3>המיקום שלנו</h3>
                    <p>
                        <strong>סניף ירושלים:</strong><br />
                        רחוב ירמיהו 48, ירושלים
                    </p>
                </div>
                <div>
                    <h3>משוב</h3>
                    <form>
                        <input type="email" placeholder="אימייל:"></input>
                        <textarea placeholder=":הקלידי כאן"></textarea>
                        <button type="submit">שליחה</button>
                    </form>
                </div>
                <div className="footer-bottom">
                    <p dir="ltr">© 2026 PRIMELACE. ALL RIGHTS RESERVED. Designed with Love.</p>
                </div>
            </div>
        </footer>
        </>
    )
}