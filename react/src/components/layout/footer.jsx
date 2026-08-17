import { NavLink } from "react-router-dom";
import "../../styles/layout.css";

export function Footer() {
    return (
        <footer className="footer-container" dir="rtl">
            <div className="footer-content">
                <nav className="footer-nav">
                    <h3>הסלון שלנו</h3>
                    <ul>
                        <li><NavLink to="/about">אודותינו</NavLink></li>
                        <li><NavLink to="/contact">צרי קשר</NavLink></li>
                        <li><NavLink to="/appointment">תיאום פגישה</NavLink></li>
                    </ul>
                </nav>

                <nav className="footer-nav">
                    <h3>השכרה</h3>
                    <ul>
                        <li><NavLink to="/collections">דפדוף בקטלוגים</NavLink></li>
                        <li><NavLink to="/sizing">מידות</NavLink></li>
                    </ul>
                </nav>

                <div className="footer-location">
                    <h3>המיקום שלנו</h3>
                    <p>
                        <strong>סניף ירושלים:</strong><br />
                        רחוב ירמיהו 48, ירושלים
                    </p>
                </div>

                <div className="footer-feedback">
                    <h3>משוב</h3>
                    <form className="feedback-form">
                        <input type="email" placeholder="אימייל:" />
                        <textarea placeholder=":הקלידי כאן"></textarea>
                        <button type="submit">שליחה</button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom">
                <p dir="ltr">© 2026 PRIMELACE. ALL RIGHTS RESERVED. Designed with Love.</p>
            </div>
        </footer>
    );
}