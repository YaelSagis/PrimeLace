import { useEffect, useState } from "react";
import "../styles/contact.css"

export function Contact()
{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleContactSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
    };

    useEffect(() => {
        if (!submitted) return;
        const timer = setTimeout(() => setSubmitted(false), 5000);
        return () => clearTimeout(timer);
    }, [submitted]);

    return (
        <div className="contact-page">
            <div className="contact-left-side">
                <h1>CONTACT PAGE</h1>
                <h3>מזמינים אותך לסטודיו שלנו</h3>
                
                <div>
                    <div>
                        <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874361/maps-and-flags_qxgilw.png" alt="Address" className="contact-icon" />
                        <div>
                            <strong>Address</strong>
                            <p>רחוב ממילא, ירושלים</p>
                        </div>
                    </div>

                    <div>
                        <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874361/telephone_e43nar.png" alt="Phone" className="contact-icon" />
                        <div>
                            <strong>Phone</strong>
                            <p>+123 655-6330</p>
                        </div>
                    </div>

                    <div>
                        <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874360/mail_1_jlyfan.png" alt="Email" className="contact-icon" />
                        <div>
                            <strong>Email</strong>
                            <p>primeLace@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-right-side">
                {submitted ? (
                    <div className="contact-success-msg">
                        <p>ההודעה נמסרה בהצלחה! תודה לך 🤍</p>
                    </div>
                ) : (
                    <form onSubmit={handleContactSubmit}>
                        <div className="form-row">
                            <input type="text" placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} required />
                            <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <input type="text" placeholder="נושא" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                        <textarea placeholder="מסר" value={message} onChange={(e) => setMessage(e.target.value)} rows="5" required></textarea>
                        <button type="submit">SEND</button>
                    </form>
                )}

                <div className="map-container">
                    <iframe
                        title="studio-location"
                        src="https://maps.google.com/maps?q=Mamilla%20Avenue%2C%20Jerusalem&output=embed"
                        width="100%"
                        height="100%"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}