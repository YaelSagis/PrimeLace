import "../styles/about.css";
const img1 = "https://res.cloudinary.com/x0um3j7c/image/upload/v1786875112/Gemini_Generated_Image_2ksjck2ksjck2ksj_fr3mtw.png";
const img2 = "https://res.cloudinary.com/x0um3j7c/image/upload/v1786875113/Gemini_Generated_Image_3vd1yy3vd1yy3vd1_pbw70j.png";
const img3 = "https://res.cloudinary.com/x0um3j7c/image/upload/v1786875112/Gemini_Generated_Image_ca1ydwca1ydwca1y_e6nyxt.png";
const img4 = "https://res.cloudinary.com/x0um3j7c/image/upload/v1786875113/Gemini_Generated_Image_5oyqc5oyqc5oyqc5_bmzlhy.png";
const img5 = "https://res.cloudinary.com/x0um3j7c/image/upload/v1786875111/Gemini_Generated_Image_93hkoq93hkoq93hk_bhwcjl.png";
const img6 = "https://res.cloudinary.com/x0um3j7c/image/upload/v1786875112/Gemini_Generated_Image_ji34keji34keji34_y8bx5f.png";

export function About() {
    return (
        <div className="about-page">
            <div className="about-header">
                <h1>The Story of primeLace</h1>
                <br/>
                <p className="subtitle">המקום שבו אהבה, עיצוב ותחרה נפגשים</p>
            </div>
            
            <div className="about-main">
                <div className="image-grid">
                    <div className="col-1">
                        <img src={img1} className="img-tall" />
                        <img src={img2} className="img-square" />
                    </div>

                    <div className="col-2">
                        <img src={img3} className="img-square" />
                        <img src={img4} className="img-tall" />
                    </div>
                </div>
            
                <div className="text-side">
                    <div className="text-section">
                        <section>
                            <h3>החזון שלנו</h3>
                            <p>
                                בסלון הכלות <strong>primeLace</strong>, אנחנו מאמינות שכל כלה ראויה להרגיש 
                                כמו הגרסה המרהיבה ביותר של עצמה ביום המיוחד שלה. הסלון נולד מתוך תשוקה 
                                לאופנת עילית, תפירה עילית ותחרות יוקרתיות הנבחרות בקפידה מכל העולם.
                            </p>
                        </section>
                        <section>
                            <h3>החוויה שלך</h3>
                            <p>
                                אנחנו לא רק משכירות שמלות – אנחנו מלוות אותך במסע. החל מרגע בחירת הקולקציה באתר, 
                                דרך שריון התאריכים המושלמים בלוח השנה ועד לרגע שבו את צועדת אל החופה. 
                                כל שמלה אצלנו עוברת טיפול, ניקוי יבש קפדני והתאמה אישית כדי שתשבי עלייך בדיוק מירבי.
                            </p>
                        </section>
                    </div>
                    
                    <div className="bottom-images">
                        <img src={img5} />
                        <img src={img6} />
                    </div>
                </div>
            </div>
        </div>
    );
}