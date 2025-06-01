import { PrismaClient } from "@prisma/client";
import validator from "validator";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User profile retrieved successfully",
            user
        });
    } catch (error) {
        console.error("Error during profile retrieval: ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {name, phoneNumber, email} = req.body;
        
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let updateData = {};
        if (name !== undefined) {
            if (typeof name !== 'string' || validator.isLength(name, {min: 1})) {
                return res.status(400).json({
                    message: "Name must be a non-empty string"
                });
            }
            updateData.name = name;
        }

        if (phoneNumber !== undefined) {
            if (typeof phoneNumber !== 'string' || !validator.isMobilePhone(phoneNumber, 'any', {strictMode: false})) {
                return res.status(400).json({
                    message: "Phone number must be a valid mobile phone number"
                });
            }
            updateData.phoneNumber = phoneNumber;
        }

        if (email !== undefined) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }
            updateData.email = email;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(200).json({
            message: "User profile updated successfully",
            updatedUser
        });
    } catch (error) {
        console.error("Error during profile update: ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
};

export const changeUserPassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {currentPassword, newPassword} = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        });

        res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Error during password change: ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
};