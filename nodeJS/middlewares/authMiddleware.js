import jwt from "jsonwebtoken"; 

const secret="Y;Nul5Dd$Ly9uMSwH@3Mql";

export const verifyToken = (req, res, next) =>
{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token)
        return res.status(401).json({message: "לא נשלח טוקן אבטחה"});
    try{
        const decoded = jwt.verify(token, secret);
        req.user=decoded;
        next();
    }
    catch(err)
    {
        return res.status(403).json({message: "טוקן לא תקין"});
    }
};

export const verifyAdmin = (req, res, next) => 
{
    if (!req.user) {
        return res.status(401).json({ message: "לא זוהה משתמש במערכת, פעולה נדחתה" });
    }

    if (req.user.userType !== "admin")
    {
        return res.status(403).json({ message: "גישה נדחתה! פעולה זו מותרת למנהלי מערכת בלבד" });
    }
    next();
};
