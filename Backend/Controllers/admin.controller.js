import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import Admin from "../Models/Admin.js";
import Role from "../Models/Role.js";
import { CreateError } from "../Utilities/Error.js";
import { CreateSuccess } from "../Utilities/Success.js";

// Controller to create a new admin
export const createAdmin = async (req, res, next) => {
    try {
        const { name, staffId, email, password } = req.body;

        // Validate input
        if (!name || !staffId || !email || !password) {
            return next(CreateError(400, "All fields are required"));
        }

        if (!validator.isEmail(email)) {
            return next(CreateError(400, "Invalid email format"));
        }

        // Check if admin role exists
        const role = await Role.findOne({ role: "Admin" });
        if (!role) {
            return next(CreateError(400, "Admin role not found"));
        }

        // Check if staff ID or email already exists
        const existingAdmin = await Admin.findOne({ $or: [{ staffId }, { email }] });
        if (existingAdmin) {
            return next(CreateError(409, "Admin with this staff ID or email already exists"));
        }

        // Hash the password using dynamic salt rounds from the environment
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10; // Default to 10 if not set
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({
            name,
            staffId,
            email,
            password: hashedPassword,
            isAdmin: true,
            roles: [role._id],
        });

        // Save admin to the database
        await newAdmin.save();

        return res.status(201).json(CreateSuccess(201, "Admin created successfully", { id: newAdmin._id, name }));
    } catch (error) {
        console.error("Error creating admin:", error.message);
        return next(CreateError(500, "Internal server error"));
    }
};

// Controller for admin login
export const adminLogin = async (req, res, next) => {
    try {
        const { staffId, password } = req.body;

        if (!staffId || !password) {
            return next(CreateError(400, "Staff ID and password are required"));
        }

        const admin = await Admin.findOne({ staffId }).populate("roles", "role");
        if (!admin) {
            return next(CreateError(404, "Admin not found"));
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return next(CreateError(400, "Invalid password"));
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, staffId: admin.staffId, isAdmin: admin.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "1h" }
        );

        // Set the cookie with the token
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        });

        return res.status(200).json({
            status: 200,
            message: "Admin login successful",
            data: { id: admin._id, name: admin.name, staffId: admin.staffId },
        });
    } catch (error) {
        console.error("Error during admin login:", error.message);
        return next(CreateError(500, "Internal server error"));
    }
};
