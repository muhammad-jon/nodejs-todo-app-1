
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: 'user not authenticated'});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).json({message:"Token wrong or expired"})
    }
}