import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // Extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password"); // Assign user object to req.user
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});
