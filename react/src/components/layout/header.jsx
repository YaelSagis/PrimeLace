import { NavLink } from "react-router-dom";
import "../../styles/layout.css";

export function Header() {
    return (
        <header>
            <NavLink to="/">
                <img src="https://res.cloudinary.com/x0um3j7c/image/upload/v1786875052/Gemini_Generated_Image_5hi5yo5hi5yo5hi5_vtdv4v.png" alt="Logo" />
            </NavLink>
        </header>
    );
}