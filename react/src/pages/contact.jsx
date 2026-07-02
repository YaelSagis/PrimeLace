import { useState } from "react";

export function Contact() {
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
                <h1>CONTACT PAGE.</h1>
                <p>מזמינים אותך לסטודיו שלנו</p>
                
                <div>
                    <div>
                        <span>⚲</span>
                        <div>
                            <strong>Address</strong>
                            <p>רחוב ירמיהו 48, ירושלים</p>
                        </div>
                    </div>

                    <div>
                        <span>☏</span>
                        <div>
                            <strong>Phone</strong>
                            <p>+123 655-6330</p>
                        </div>
                    </div>

                    <div>
                        <span>✉</span>
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
                        <button onClick={() => setSubmitted(false)}>Send</button>
                    </div>
                ) : (
                    <form onSubmit={handleContactSubmit}>
                        <div>
                            <input 
                                type="text" 
                                placeholder="שם" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                            <input 
                                type="email" 
                                placeholder="אימייל" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

                        <input 
                            type="text" 
                            placeholder="נושא" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required 
                        />

                        <textarea 
                            placeholder="מסר" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            rows="4"
                            required
                        ></textarea>

                        <button type="submit">Send</button>
                    </form>
                )}

                <div className="map-container">
                    <iframe 
                        title="studio-location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3391.1982439120757!2d35.208281724102605!3d31.79234667409057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502d6248fe3d5bd%3A0x3bfff2646a812983!2z15nXqNee15nXlNeVIDQ4LCDXmdeo15XXqdec15nXnQ!5e0!3m2!1siw!2sil!4v1782934401218!5m2!1siw!2sil"
                        width="100%" 
                        height="100%" 
                        allowFullScreen="" 
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}