import adminModel from "../models/admin.model.js";
import { hashPassword, comparePassword } from "../config/hashPassword.js";
import { generateToken } from "../config/jwt.js";
import { verifyToken } from "../config/jwt.js";

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    };
}

async function createAdminRoute(req, res) {
    try {
        const { name, email, password } = req.body;

        // validate fields
        if (!name || !email || !password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingAdminCount = await adminModel.countDocuments();

        if (existingAdminCount > 0) {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({ status: "failed", message: "Unauthorized" });
            }

            const decodedToken = verifyToken(token);
            const requestingAdmin = await adminModel.findById(decodedToken.id);

            if (!requestingAdmin) {
                return res.status(401).json({ status: "failed", message: "Unauthorized" });
            }
        }

        // check if admin already exists
        const normalizedEmail = email.trim().toLowerCase();
        const admin = await adminModel.findOne({ email: normalizedEmail });
        if (admin) {
            return res.status(400).json({ status: "failed", message: "Admin already exists" });
        }

        // hash password
        const hashedPassword = await hashPassword(password);

        // create admin
        const newAdmin = await adminModel.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });

        // generate token
        const token = generateToken({ id: newAdmin._id });

        // set token in cookie
        res.cookie("token", token, getCookieOptions());

        return res.status(201).json({ status: "success", message: "Admin created successfully", data: { name: newAdmin.name, email: newAdmin.email } });
    } catch (error) {
        console.log("error in create admin", error);
        return res.status(500).json({ status: "failed", message: "Internal server error", error });
    }
}

async function loginAdminRoute(req, res) {
    try {
        const { email, password } = req.body;

        // validate fields
        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        // check if admin exists
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ status: "failed", message: "Admin not found" });
        }

        // check if password is valid
        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "failed", message: "Invalid password" });
        }

        // generate token
        const token = generateToken({ id: admin._id });

        // set token in cookie
        res.cookie("token", token, getCookieOptions());

        // return admin data
        return res.status(200).json({ status: "success", message: "Admin logged in successfully", data: { name: admin.name, email: admin.email } });
    } catch (error) {
        console.log("error in login admin", error);
        return res.status(500).json({ status: "failed", message: "Internal server error", error });
    }
}

async function getCurrentAdmin(req, res) {
    try {
        const adminId = req.adminId;
        const admin = await adminModel.findById(adminId).select("-password");

        if (!admin) {
            return res.status(404).json({ status: "failed", message: "Admin not found" });
        }

        return res.status(200).json({ status: "success", data: admin });
    } catch (error) {
        console.log("error in get current admin", error);
        return res.status(500).json({ status: "failed", message: "Internal server error", error });
    }
}

function logoutAdmin(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return res.status(200).json({ status: "success", message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout admin", error);
        return res.status(500).json({ status: "failed", message: "Internal server error", error });
    }
}

export { createAdminRoute, loginAdminRoute, getCurrentAdmin, logoutAdmin };
