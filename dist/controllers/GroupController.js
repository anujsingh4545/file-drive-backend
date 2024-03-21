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
exports.DeleteMember = exports.DeleteUser = exports.ChangeRole = exports.GetAllMembers = exports.deletePFile = exports.removeTrash = exports.makeTrash = exports.RemoveFavs = exports.UploadFavs = exports.UploadFileControl = exports.GetAllFile = exports.DeleteGroup = exports.CreateGroup = void 0;
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const FileUploadCloudinary_1 = require("./FileUploadCloudinary");
const CreateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { name, userId } = req.body;
    console.log(name, userId);
    try {
        yield prisma.group.create({
            data: {
                name: name,
                createdBy: userId,
                admins: { connect: { id: userId } },
                members: { connect: { id: userId } },
                GroupMembership: {
                    create: {
                        userId: userId,
                        joinedAt: new Date(),
                    },
                },
            },
        });
        return res.status(200).send({ message: "Group created sucessfully!", success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Something went wrong", success: false });
    }
});
exports.CreateGroup = CreateGroup;
const DeleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { grpId, userId } = req.body;
    try {
        yield prisma.groupMembership.deleteMany({
            where: {
                groupId: grpId,
            },
        });
        yield prisma.groupFile.deleteMany({
            where: {
                groupId: grpId,
            },
        });
        yield prisma.request.deleteMany({
            where: {
                groupId: grpId,
            },
        });
        yield prisma.group.delete({
            where: {
                id: grpId,
            },
        });
        return res.status(200).send({
            message: "Group deleted Sucessfully!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).send({
            message: "Some error occured",
            success: false,
        });
    }
});
exports.DeleteGroup = DeleteGroup;
const GetAllFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { groupId, userId } = req.body;
    try {
        const file = yield prisma.group.findUnique({
            where: {
                id: groupId,
            },
            include: {
                files: {
                    orderBy: {
                        createdAt: "desc", // Sort by createdAt timestamp in descending order
                    },
                },
            },
        });
        if (file) {
            let GrpFiles = file.files;
            const promises = GrpFiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const userData = yield prisma.user.findUnique({
                        where: {
                            id: file.createdById,
                        },
                    });
                    if (userData) {
                        file.email = userData.email;
                        file.name = userData.name;
                        file.profile = userData.profile;
                    }
                }
                catch (error) {
                    throw error;
                }
            }));
            yield Promise.all(promises);
            return res.status(200).json({ files: GrpFiles, success: true });
        }
        else {
            return res.status(404).json({ message: "User not found", success: false });
        }
    }
    catch (error) {
        return res.status(404).json({ message: "Error", success: false });
    }
});
exports.GetAllFile = GetAllFile;
const UploadFileControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("fkdf");
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    let title;
    let userid;
    let GroupId;
    if (Array.isArray(req.fields.title)) {
        title = req.fields.title[0];
    }
    else {
        title = req.fields.title;
    }
    if (Array.isArray(req.fields.userid)) {
        userid = req.fields.userid[0];
    }
    else {
        userid = req.fields.userid;
    }
    if (Array.isArray(req.fields.GroupId)) {
        GroupId = req.fields.GroupId[0];
    }
    else {
        GroupId = req.fields.GroupId;
    }
    const file = req.files;
    let filetype;
    if (file.image.type.includes("spreadsheetml"))
        filetype = "xlsx";
    else if (file.image.type.includes("wordprocessingml.document"))
        filetype = "docx";
    else if (file.image.type.includes("pdf"))
        filetype = "pdf";
    else if (file.image.type.includes("png"))
        filetype = "png";
    else if (file.image.type.includes("jpg"))
        filetype = "jpg";
    else if (file.image.type.includes("jpeg"))
        filetype = "jpeg";
    else {
        filetype = "null";
    }
    if (!title || !userid || !file || !GroupId) {
        return res.status(400).send({ message: "Missing title or userid or file", success: false });
    }
    try {
        const data = yield (0, FileUploadCloudinary_1.FileUpload)(file.image.path, filetype);
        if (data) {
            yield prisma.groupFile.create({
                data: {
                    title: title,
                    filetype: filetype,
                    url: data.url,
                    groupId: GroupId,
                    createdById: userid,
                },
            });
            return res.status(200).send({
                message: "File uploaded sucessfully",
                success: true,
            });
        }
        else {
            return res.status(400).send({ message: "Something went wrong", success: false });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Something went wrong", success: false });
    }
});
exports.UploadFileControl = UploadFileControl;
const UploadFavs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { fileId } = req.body;
    try {
        const File = yield prisma.groupFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.groupFile.update({
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
        const File = yield prisma.groupFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.groupFile.update({
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
        const File = yield prisma.groupFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.groupFile.update({
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
        const File = yield prisma.groupFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.groupFile.update({
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
        const File = yield prisma.groupFile.findUnique({
            where: {
                id: fileId,
            },
        });
        if (File) {
            yield prisma.groupFile.delete({
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
const GetAllMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const mySet = new Set();
    const addToSet = (dataArray) => {
        dataArray === null || dataArray === void 0 ? void 0 : dataArray.forEach((data) => {
            const existingData = Array.from(mySet).find((item) => item.id === data.id);
            if (!existingData) {
                mySet.add(data);
            }
        });
    };
    const { groupId, userId } = req.body;
    try {
        const data = yield prisma.group.findUnique({
            where: {
                id: groupId,
            },
            include: {
                admins: true,
                members: true,
            },
        });
        if (data) {
            const admin = data === null || data === void 0 ? void 0 : data.admins;
            const member = data.members;
            admin.forEach((user) => {
                user.role = "admin";
                user.createdBy = data.createdBy;
            });
            member.forEach((user) => {
                user.role = "member";
                user.createdBy = data.createdBy;
            });
            addToSet(admin);
            addToSet(member);
            yield Promise.all(Array.from(mySet).map((group) => __awaiter(void 0, void 0, void 0, function* () {
                const groupData = yield prisma.groupMembership.findFirst({
                    where: {
                        groupId: groupId,
                        userId: group.id,
                    },
                    select: {
                        joinedAt: true,
                    },
                });
                group.joined = groupData === null || groupData === void 0 ? void 0 : groupData.joinedAt;
            })));
            mySet.forEach((element) => {
                if (element.id == data.createdBy) {
                    mySet.delete(element);
                }
            });
            const membersArray = Array.from(mySet);
            return res.status(200).send({
                members: membersArray,
                success: true,
            });
        }
    }
    catch (error) {
        return res.status(400).send({
            message: "Something went wrong!",
            success: false,
        });
    }
});
exports.GetAllMembers = GetAllMembers;
const ChangeRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { UserId, groupId, role } = req.body;
    try {
        if (role == "admin") {
            yield prisma.group.update({
                where: {
                    id: groupId,
                },
                data: {
                    admins: { connect: { id: UserId } },
                },
            });
        }
        else {
            yield prisma.group.update({
                where: {
                    id: groupId,
                },
                data: {
                    admins: { disconnect: { id: UserId } },
                },
            });
        }
        return res.status(200).send({
            message: "Role updated sucessfully!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Something went wrong! ",
            success: false,
        });
    }
});
exports.ChangeRole = ChangeRole;
const DeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { UserId, groupId } = req.body;
    try {
        yield prisma.groupMembership.deleteMany({
            where: {
                userId: UserId,
                groupId: groupId,
            },
        });
        yield prisma.group.update({
            where: {
                id: groupId,
            },
            data: {
                members: { disconnect: { id: UserId } },
            },
        });
        return res.status(200).send({
            message: " User removed successfully!",
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
exports.DeleteUser = DeleteUser;
const DeleteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    const { userId, groupId } = req.body;
    try {
        yield prisma.groupMembership.deleteMany({
            where: {
                userId: userId,
                groupId: groupId,
            },
        });
        yield prisma.group.update({
            where: {
                id: groupId,
            },
            data: {
                members: { disconnect: { id: userId } },
            },
        });
        return res.status(200).send({
            message: " User removed successfully!",
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
exports.DeleteMember = DeleteMember;
//# sourceMappingURL=GroupController.js.map