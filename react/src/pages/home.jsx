import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { useEffect } from "react";
import { getLatestCategoryThunk } from "../redux/slices/categoriesSlice";
import { getPopularDressesThunk } from "../redux/slices/dressesSlice";

export function Home() {
    const navi = useNavigate();
    const dispatch = useDispatch();

    const latestCategory = useSelector((state) => state.categories.latestCategory);
    const latestStatus = useSelector((state) => state.categories.latestStatus);
    const popularDresses = useSelector((state) => state.dresses.popularDresses);
    const popularStatus = useSelector((state) => state.dresses.popularStatus);

    useEffect(() => {
        dispatch(getLatestCategoryThunk());
        dispatch(getPopularDressesThunk());
    }, [dispatch]);

    const latestLoading = !latestCategory && latestStatus !== 'succeeded';
    const popularLoading = popularDresses.length === 0 && popularStatus !== 'succeeded';


    return (
        <div className="homepage">
            <header className="hero-video-section">
                <video autoPlay loop muted playsInline className="hero-video">
                    <source src="https://res.cloudinary.com/x0um3j7c/video/upload/v1786649155/dress1-video_r1uwvh.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay">
                    <h1>PURE ELEGANCE.</h1>
                    <button className="explore-btn" onClick={() => navi('/collections/6a4fee1efd0cef1ca059d166')}>
                        EXPLORE THE COLLECTION
                    </button>
                </div>
            </header>

            <div className="section-lace-divider">
                <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874216/vintage_pxvw6l.png" alt="Divider" className="vintage-divider-img"/>
            </div>

            <section className="magazine-hero">
                {latestLoading ? (
                    <div className="home-section-loading">טוענת את הקולקציה האחרונה...</div>
                ) : !latestCategory || !latestCategory._id ? (
                    <div className="home-section-loading">עדיין אין קולקציות באתר. חוזרים בקרוב!</div>
                ) : (
                    <>
                        <div className="hero-text-side">
                            <span className="hero-badge">LATEST COLLECTION</span>
                            <h1>{latestCategory.name}</h1>
                            <p>גלי את העיצובים החדשים והמתוחכמים שלנו שמשלבים מסורת ויוקרה.</p>
                            <button className="explore-btn" onClick={() => navi(`/collections/${latestCategory._id}`)}>
                                EXPLORE THE COLLECTION
                            </button>
                        </div>
                        <div className="hero-image-side">
                            <img src={latestCategory.image} alt={latestCategory.name} className="hero-main-img" />
                        </div>
                    </>
                )}
            </section>

            <div className="section-lace-divider">
                <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874217/Gemini_Generated_Image_jau7bljau7bljau7_hupe2c.png" alt="Divider" className="vintage-divider-img" loading="lazy"/>
                <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874217/Gemini_Generated_Image_jau7bljau7bljau7_hupe2c.png" alt="Divider" className="vintage-divider-img" loading="lazy"/>
                <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874217/Gemini_Generated_Image_jau7bljau7bljau7_hupe2c.png" alt="Divider" className="vintage-divider-img" loading="lazy"/>
                <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874217/Gemini_Generated_Image_jau7bljau7bljau7_hupe2c.png" alt="Divider" className="vintage-divider-img" loading="lazy"/>
                <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786874217/Gemini_Generated_Image_jau7bljau7bljau7_hupe2c.png" alt="Divider" className="vintage-divider-img" loading="lazy"/>
            </div>

            <div className="home-cta-footer">
                <button className="editorial-cta-btn" onClick={() => navi("/all-dresses")}>
                    VIEW ALL DRESSES ➔
                </button>
            </div>

            <div className="popular-wrapper">
                <div className="section-divider">
                    <h2>FEATURED STORIES</h2>
                    <div className="small-line"></div>
                </div>
                <section className="vertical-videos-section">
                    <div className="video-card" onClick={() => navi('/product/6a80e0a9a6c7208f45b942c0')}>
                        <video src="https://res.cloudinary.com/x0um3j7c/video/upload/v1784478746/dress15-video_uzjfdn.mp4" autoPlay loop muted playsInline preload="none" />
                    </div>
                    <div className="video-card" onClick={() => navi('/product/6a4ff540fd0cef1ca059d16c')}>
                        <video src="https://res.cloudinary.com/x0um3j7c/video/upload/v1784478746/dress0-video_tjjup9.mp4" autoPlay loop muted playsInline preload="none" />
                    </div>
                    <div className="video-card" onClick={() => navi('/product/6a53004c740186897f116cea')}>
                        <video src="https://res.cloudinary.com/x0um3j7c/video/upload/v1784482964/dress7-video_pxrvz9.mp4" autoPlay loop muted playsInline preload="none" />
                    </div>
                </section>
            </div>

            <section className="brand-quote-section">
                <div className="quote-content">
                    <span className="quote-mark">“</span>
                    <p>היופי האמיתי מתחיל ברגע שאת בוחרת להיות נאמנה לעצמך ולסגנון הייחודי שלך.</p>
                    <span className="quote-author">PRIME LACE ATELIER</span>
                </div>
            </section>

            <div className="section-divider">
                <h2>POPULAR PIECES</h2>
                <div className="small-line"></div>
            </div>
            <section className="editorial-collections-section">

            {popularLoading ? (
                <div className="home-section-loading">טוענות את השמלות הפופולריות...</div>
            ) : popularDresses.length === 0 ? (
                <div className="home-section-loading">אין עדיין שמלות פופולריות להצגה.</div>
            ) : (
                popularDresses.map((dress, index) => {
                    const isReverse = index % 2 !== 0;

                    const imagesToDisplay = dress.images;

                    return (
                    <div
                        key={index}
                        className={`collection-row ${isReverse ? 'reverse' : ''}`}
                    >
                        <div className="trio-images-wrapper">
                        {imagesToDisplay.map((imgSrc, imgIndex) => (
                            <div key={imgIndex} className="trio-img-card">
                            <img
                                src={imgSrc}
                                alt={dress.name}
                                loading="lazy"
                            />
                            </div>
                        ))}
                        </div>

                        <div className="row-text-side">
                        <h3>{dress.name}</h3>
                        <button
                            className="discover-btn"
                            onClick={() => navi(`/product/${dress._id}`)}
                        >
                            DISCOVER THE LINE
                        </button>
                        </div>
                    </div>
                    );
                })
            )}
            </section>

            <section className="brand-values-section">
                <div className="value-item">
                    <h4>HAUTE COUTURE</h4>
                    <p>בדים נבחרים ברמה הגבוהה ביותר בעולם</p>
                </div>
                <div className="value-divider-line"></div>
                <div className="value-item">
                    <h4>TAILORED FIT</h4>
                    <p>התאמה אישית מדויקת לכל כלה</p>
                </div>
                <div className="value-divider-line"></div>
                <div className="value-item">
                    <h4>PRIVATE EXPERIENCE</h4>
                    <p>ליווי אישי ומקצועי בסלון</p>
                </div>
            </section>

            <section className="cinematic-video-section">
                <video autoPlay loop muted playsInline preload="none" className="cinematic-video">
                    <source src="https://res.cloudinary.com/x0um3j7c/video/upload/v1786647674/PrimeLace_%D7%A1%D7%9C%D7%95%D7%9F_%D7%94%D7%9B%D7%9C%D7%95%D7%AA_%D7%94%D7%9E%D7%95%D7%91%D7%99%D7%9C_%D7%A9%D7%9C%D7%9A_202607212142_yvusuy.mp4" type="video/mp4" />
                </video>
                <div className="cinematic-overlay"></div>
            </section>

            <div className="home-cta-footer">
                <button className="editorial-cta-btn" onClick={() => navi("/collections")}>
                    VIEW ALL COLLECTIONS ➔
                </button>
            </div>
        </div>
    );
}