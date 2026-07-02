import { NavLink } from "react-router-dom";

export function Header()
{

    return(
        <>
        <header>
            <NavLink to="/">
                <img src="/logos/Gemini_Generated_Image_5hi5yo5hi5yo5hi5.png"></img>
            </NavLink>
        </header>
        </>
    )
    // <Box 
    //   sx={{ 
    //     display: 'flex', 
    //     justifyContent: 'center', 
    //     alignItems: 'center', 
    //     paddingTop: '30px',
    //     paddingBottom: '10px',
    //     backgroundColor: 'background.default'
    //   }}
    // >
    //   <Typography 
    //     variant="h2" 
    //     sx={{ 
    //       fontFamily: '"Playfair Display", serif',
    //       fontSize: { xs: '2rem', sm: '3rem' },
    //       letterSpacing: '2px',
    //       color: '#2C2A29'
    //     }}
    //   >
    //     Bridal Glamour
    //   </Typography>
    // </Box>
}