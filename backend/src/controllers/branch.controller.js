import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllBranches = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {city, province, isActive} = req.query;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found or not authenticated. Please log in."
            });
        }

        const branches = await prisma.branch.findMany({
            where: {
                AND: [
                    city ? {
                        city: {
                            contains: city,
                            mode: 'insensitive'
                        }
                    } : {},
                    province ? {
                        province: {
                            contains: province,
                            mode: 'insensitive'
                        }
                    } : {},
                    isActive !== undefined ? {
                        isActive: isActive === 'true'
                    } : {}
                ]
            },
            select: {
                services: {
                    where: {
                        isActive: true
                    },
                    select: {
                        id: true,
                        name: true,
                        estimatedTime: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.status(200).json({
            message: "Branches retrieved successfully",
            branches
        });
    } catch (error) {
        console.error("Error during retrieving branches: ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
};

export const getBranchById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {branchId} = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found or not authenticated. Please log in."
            });
        }

        const branch = await prisma.branch.findUnique({
            where: {
                id: branchId
            },
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                province: true,
                postalCode: true,
                phoneNumber: true,
                email: true,
                isActive: true,
                services: {
                    where: {
                        isActive: true
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        estimatedTime: true,
                        maxQueuePerDay: true
                    }
                }
            }
        });
        if (!branch) {
            return res.status(404).json({
                message: "Branch not found"
            });
        }

        res.status(200).json({
            message: "Branch retrieved successfully",
            branch
        });
    } catch (error) {
        console.error("Error during retrieving branch: ", error);
        return res.status(500).json({
            message: "Inteernal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
};