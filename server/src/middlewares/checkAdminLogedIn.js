import { verifyToken } from "../config/jwt.js";

function isAdminLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ status: "failed", message: "Unauthorized" });
        }
        const decodedToken = verifyToken(token);
        req.adminId = decodedToken.id;
        next();
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Internal server error", error });
    }
}

export {isAdminLoggedIn};