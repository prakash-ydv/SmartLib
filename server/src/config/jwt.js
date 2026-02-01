import jwt from "jsonwebtoken";

function generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export { generateToken, verifyToken };