import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/layout.css";

export function Footer() {
    const [feedbackEmail, setFeedbackEmail] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackSent, setFeedbackSent] = useState(false);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        setFeedbackSent(true);
        setFeedbackEmail("");
        setFeedbackMessage("");
    };

    useEffect(() => {
        if (!feedbackSent) return;
        const timer = setTimeout(() => setFeedbackSent(false), 5000);
        return () => clearTimeout(timer);
    }, [feedbackSent]);

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
                        רחוב ממילא, ירושלים
                    </p>
                </div>

                <div className="footer-feedback">
                    <h3>משוב</h3>
                    {feedbackSent ? (
                        <p className="feedback-success-msg">תודה על המשוב שלך! 🤍</p>
                    ) : (
                        <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
                            <input
                                type="email"
                                placeholder="אימייל:"
                                value={feedbackEmail}
                                onChange={(e) => setFeedbackEmail(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder=":הקלידי כאן"
                                value={feedbackMessage}
                                onChange={(e) => setFeedbackMessage(e.target.value)}
                                required
                            ></textarea>
                            <button type="submit">שליחה</button>
                        </form>
                    )}
                </div>
            </div>

            <div className="footer-bottom">
                <p dir="ltr">© 2026 PRIMELACE. ALL RIGHTS RESERVED. Designed with Love.</p>
            </div>
        </footer>
    );
}
