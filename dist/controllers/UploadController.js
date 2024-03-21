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
exports.UploadFileControl = void 0;
const FileUploadCloudinary_1 = require("./FileUploadCloudinary");
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const UploadFileControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URLS,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    let title;
    let userid;
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
    if (!title || !userid || !file) {
        return res.status(400).send({ message: "Missing title or userid or file", success: false });
    }
    try {
        const data = yield (0, FileUploadCloudinary_1.FileUpload)(file.image.path, filetype);
        if (data) {
            const file = yield prisma.userPersonalFile.create({
                data: {
                    title: title,
                    filetype: filetype,
                    url: data.url,
                    userId: userid,
                },
            });
            return res.status(200).send({
                message: "file uploaded sucessfully",
                file: file,
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
//# sourceMappingURL=UploadController.js.map