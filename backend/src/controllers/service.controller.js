import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllServices = async (req, res) => {
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

        const services = await prisma.service.findMany({
            where: {
                branchId: branchId
            },
            select: {
                id: true,
                name: true,
                isActive: true,
                branch: {
                    select: {
                        name: true
                    }
                }
            }
        });

        res.status(200).json({
            message: "Services retrieved successfully",
            services
        });
    } catch (error) {
        console.error("Error during service retrieval: ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {branchId, serviceId} = req.params;
        
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

        const service = await prisma.service.findFirst({
            where: {
                id: serviceId,
                branchId: branchId
            },
            select: {
                id: true,
                name: true,
                description: true,
                estimatedTime: true,
                maxQueuePerDay: true,
                isActive: true,
                branch: {
                    select: {
                        name: true
                    }
                }
            }
        });

        res.status(200).json({
            message: "Service retrieved successfully",
            service
        });
    } catch (error) {
        console.error("Error during service retrieval: ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
};