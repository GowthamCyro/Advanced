import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request: Missing token");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "User not found! Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message); // Log error message
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        } else if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid access token");
        } else {
            throw new ApiError(401, "Unauthorized request");
        }
    }
});
