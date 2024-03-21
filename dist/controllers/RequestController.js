"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclineReq = exports.AcceptReq = exports.GetAll = exports.AddRequest = void 0;
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const AddRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { groupId, UserId, role } = req.body;
    try {
        const checkRequest = yield prisma.request.findFirst({
            where: {
                groupId: groupId,
                userId: UserId,
            },
        });
        if (checkRequest) {
            return res.status(200).send({
                message: "Request already sent!",
                success: false,
            });
        }
        const verifyuser = yield prisma.user.findUnique({
            where: {
                id: UserId,
            },
        });
        if (!verifyuser) {
            return res.status(200).send({
                message: "User not found!",
                success: false,
            });
        }
        const verifyGroup = yield prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });
        if (!verifyGroup) {
            return res.status(200).send({
                message: " Group not found!",
                success: false,
            });
        }
        const checkpreadded = yield prisma.group.findUnique({
            where: {
                id: groupId,
            },
            include: {
                members: {
                    where: {
                        id: UserId,
                    },
                },
                admins: {
                    where: {
                        id: UserId,
                    },
                },
            },
        });
        const isMember = checkpreadded.members.length > 0;
        const isAdmin = checkpreadded.admins.length > 0;
        if (isMember || isAdmin) {
            return res.status(200).send({
                message: "User already added to group !",
                success: false,
            });
        }
        yield prisma.request.create({
            data: {
                role: role,
                groupName: verifyGroup.name,
                groupId: groupId,
                userId: UserId,
            },
        });
        return res.status(200).send({
            message: "Request sent!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Something went wrong!",
            success: false,
        });
    }
});
exports.AddRequest = AddRequest;
const GetAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { userId } = req.body;
    try {
        const userReq = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                requests: {
                    orderBy: {
                        date: "desc",
                    },
                },
            },
        });
        return res.status(200).send({
            req: userReq === null || userReq === void 0 ? void 0 : userReq.requests,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Something went wrong!",
            success: false,
        });
    }
});
exports.GetAll = GetAll;
const AcceptReq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { id, UserId, groupId, role } = req.body;
    try {
        const reqVerify = yield prisma.request.findUnique({
            where: {
                id: id,
            },
        });
        if (!reqVerify) {
            return res.status(200).send({
                message: "Request not found!",
                success: false,
            });
        }
        if (role == "admin") {
            yield prisma.group.update({
                where: {
                    id: groupId,
                },
                data: {
                    admins: { connect: { id: UserId } },
                    members: { connect: { id: UserId } },
                    GroupMembership: {
                        create: {
                            userId: UserId,
                            joinedAt: new Date(),
                        },
                    },
                },
            });
        }
        else {
            yield prisma.group.update({
                where: {
                    id: groupId,
                },
                data: {
                    members: { connect: { id: UserId } },
                    GroupMembership: {
                        create: {
                            userId: UserId,
                            joinedAt: new Date(),
                        },
                    },
                },
            });
        }
        yield prisma.request.delete({
            where: {
                id: id,
            },
        });
        return res.status(200).send({
            message: "Added to group Sucessfully!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Something went wrong!",
            success: false,
        });
    }
});
exports.AcceptReq = AcceptReq;
const DeclineReq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { id, UserId, groupId, role } = req.body;
    try {
        const reqVerify = yield prisma.request.findUnique({
            where: {
                id: id,
            },
        });
        if (!reqVerify) {
            return res.status(200).send({
                message: "Request not found!",
                success: false,
            });
        }
        yield prisma.request.delete({
            where: {
                id: id,
            },
        });
        return res.status(200).send({
            message: "Declined request Sucessfully!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Something went wrong!",
            success: false,
        });
    }
});
exports.DeclineReq = DeclineReq;
//# sourceMappingURL=RequestController.js.map