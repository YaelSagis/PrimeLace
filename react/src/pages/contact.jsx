import { useState } from "react";
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
                            <p>רחוב ירמיהו 48, ירושלים</p>
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
                    <div>
                        <p>ההודעה נמסרה בהצלחה! תודה לך</p>
                        {setSubmitted(false)};
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
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3391.1982439120757!2d35.208281724102605!3d31.79234667409057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502d6248fe3d5bd%3A0x3bfff2646a812983!2z15nXqNee15nXlNeVIDQ4LCDXmdeo15XXqdec15nXnQ!5e0!3m2!1siw!2sil!4v1782934401218!5m2!1siw!2sil"
                        width="100%" 
                        height="100%" 
                    ></iframe>
                </div>
            </div>
        </div>
    );
}