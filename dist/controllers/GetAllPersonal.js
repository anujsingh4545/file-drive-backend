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
exports.getalluser = exports.getallagroups = exports.deletePFile = exports.removeTrash = exports.makeTrash = exports.RemoveFavs = exports.UploadFavs = exports.GetAllFiles = void 0;
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const GetAllFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const userId = req.body.userId;
    try {
        const userData = yield prisma.user.findFirst({
            where: {
                id: userId,
            },
            include: {
                personalGroup: {
                    orderBy: {
                        createdAt: "desc", // Sort by createdAt timestamp in descending order
                    },
                },
            },
        });
        if (userData) {
            let favFiles = userData.personalGroup; // Accessing the personal files
            favFiles.forEach((file) => {
                (file.name = userData.name), (file.email = userData.email), (file.profile = userData.profile);
            });
            return res.status(200).json({ files: favFiles, success: true });
        }
        else {
            return res.status(404).json({ message: "User not found", success: false });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Error", success: false });
    }
});
exports.GetAllFiles = GetAllFiles;
const UploadFavs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { fileId } = req.body;
    try {
        const File = yield prisma.userPersonalFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.userPersonalFile.update({
                where: {
                    id: fileId,
                },
                data: {
                    favourite: true,
                },
            });
            return res.status(200).send({
                message: "Added to fav!",
                success: true,
            });
        }
        else {
            return res.status(403).send({
                message: "File not found!",
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
exports.UploadFavs = UploadFavs;
const RemoveFavs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { fileId } = req.body;
    try {
        const File = yield prisma.userPersonalFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.userPersonalFile.update({
                where: {
                    id: fileId,
                },
                data: {
                    favourite: false,
                },
            });
            return res.status(200).send({
                message: "Removed from fav!",
                success: true,
            });
        }
        else {
            return res.status(403).send({
                message: "File not found!",
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
exports.RemoveFavs = RemoveFavs;
const makeTrash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { fileId } = req.body;
    try {
        const File = yield prisma.userPersonalFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.userPersonalFile.update({
                where: {
                    id: fileId,
                },
                data: {
                    trash: true,
                    trashtime: new Date(),
                },
            });
            return res.status(200).send({
                message: "Added to trash!",
                success: true,
            });
        }
        else {
            return res.status(403).send({
                message: "File not found!",
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
exports.makeTrash = makeTrash;
const removeTrash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { fileId } = req.body;
    try {
        const File = yield prisma.userPersonalFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.userPersonalFile.update({
                where: {
                    id: fileId,
                },
                data: {
                    trash: false,
                    trashtime: null,
                },
            });
            return res.status(200).send({
                message: "Removed from trash!",
                success: true,
            });
        }
        else {
            return res.status(403).send({
                message: "File not found!",
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
exports.removeTrash = removeTrash;
const deletePFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { fileId } = req.body;
    try {
        const File = yield prisma.userPersonalFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.userPersonalFile.delete({
                where: {
                    id: fileId,
                },
            });
            return res.status(200).send({
                message: "File deleted Sucessfully!",
                success: true,
            });
        }
        else {
            return res.status(403).send({
                message: "File not found!",
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
exports.deletePFile = deletePFile;
const getallagroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { userId } = req.body;
    try {
        const Agroup = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                admin: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (Agroup) {
            return res.status(200).send({
                adminG: Agroup.admin,
                success: true,
            });
        }
        else {
            return res.status(200).send({
                message: "User not found!",
                success: false,
            });
        }
    }
    catch (error) {
        return res.status(200).send({
            message: "Something went wrong!",
            success: false,
        });
    }
});
exports.getallagroups = getallagroups;
const getalluser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { userId, username } = req.body;
    try {
        const users = yield prisma.user.findMany({
            where: {
                name: {
                    contains: username,
                    mode: "insensitive",
                },
                NOT: {
                    id: userId, // Exclude users with the provided userId
                },
            },
        });
        return res.status(200).send({
            users: users,
            success: true,
        });
    }
    catch (error) {
        return res.status(400).send({
            message: "Something went wrong!",
            success: false,
        });
    }
});
exports.getalluser = getalluser;
//# sourceMappingURL=GetAllPersonal.js.map