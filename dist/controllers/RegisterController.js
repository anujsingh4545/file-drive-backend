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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminMemberData = exports.userInfo = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma_con = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { name, email, profile } = req.body;
    try {
        const check = yield prisma_con.user.findUnique({
            where: {
                email: email,
            },
        });
        if (check) {
            const token = jsonwebtoken_1.default.sign({ id: check.id }, process.env.JWTSECRET);
            return res.status(200).send({
                message: `Welcome back ${check.name}!`,
                user: check,
                token: token,
                status: true,
            });
        }
        const user = yield prisma_con.user.create({
            data: {
                name: name,
                email: email,
                profile: profile,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWTSECRET);
        return res.status(200).send({
            message: "User registered sucessfully!",
            user: user,
            token: token,
            success: true,
        });
    }
    catch (error) {
        return res.status(400).send({
            massage: error,
            success: false,
        });
    }
});
exports.register = register;
const userInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.userId;
    if (!id) {
        return res.status(400).send({
            message: "No id found",
            success: false,
        });
    }
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            return res.status(400).send({
                messsage: "user not found",
                success: false,
            });
        }
        return res.status(200).send({
            message: " data found",
            user: user,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).send({
            message: error,
            success: false,
        });
    }
});
exports.userInfo = userInfo;
const GetAdminMemberData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { userId } = req.body;
    try {
        const userData = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                admin: true,
                member: true,
            },
        });
        if (userData) {
            let admin = userData.admin;
            let member = userData.member;
            yield Promise.all(admin.map((group) => __awaiter(void 0, void 0, void 0, function* () {
                const groupData = yield prisma.group.findUnique({
                    where: {
                        id: group.id,
                    },
                    select: {
                        members: true,
                    },
                });
                if (groupData) {
                    group.membercount = groupData.members.length;
                }
                else {
                    group.membercount = 0;
                }
            })));
            yield Promise.all(member.map((group) => __awaiter(void 0, void 0, void 0, function* () {
                const groupData = yield prisma.groupMembership.findFirst({
                    where: {
                        groupId: group.id,
                        userId: userId,
                    },
                    select: {
                        joinedAt: true,
                    },
                });
                group.userCreated = groupData === null || groupData === void 0 ? void 0 : groupData.joinedAt;
            })));
            yield Promise.all(member.map((group) => __awaiter(void 0, void 0, void 0, function* () {
                const groupData = yield prisma.group.findFirst({
                    where: {
                        id: group.id,
                    },
                    select: {
                        createdBy: true,
                    },
                });
                group.creatorId = groupData === null || groupData === void 0 ? void 0 : groupData.createdBy;
            })));
            member = member.filter((data) => data.creatorId !== userId);
            return res.status(200).send({
                message: "Data fetched successfully!",
                admin: admin,
                member: member,
                success: true,
            });
        }
        else {
            return res.status(200).send({
                message: "Something went wrong",
                success: false,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(403).send({
            message: "Something went wrong",
            success: false,
        });
    }
});
exports.GetAdminMemberData = GetAdminMemberData;
//# sourceMappingURL=RegisterController.js.map