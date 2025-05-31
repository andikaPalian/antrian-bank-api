import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        // Pastikan header Authorization ada dan diawali format "Bearer <token>"
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({
                message: "Token is missing or not provided"
            });
        }

        const token = authHeader.split(" ")[1];

        // Verifikasi token JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(403).json({
                message: error.name === "TokenExpiredError" ? "Unauthorized: Token has expired" : "Unauthorized: Invalid token"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = {
            userId: user.id,
            email: user.email
        };

        next();
    } catch (error) {
        console.error("Error during authentication: ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
};