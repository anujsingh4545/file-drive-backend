"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_formidable_1 = __importDefault(require("express-formidable"));
const UploadController_1 = require("../controllers/UploadController");
const Protect_1 = require("../middleware/Protect");
const GetAllPersonal_1 = require("../controllers/GetAllPersonal");
const route = (0, express_1.Router)();
route.post("/upload", (0, express_formidable_1.default)(), UploadController_1.UploadFileControl);
route.post("/getallfile", Protect_1.VerifyUser, GetAllPersonal_1.GetAllFiles);
route.post("/makefav", GetAllPersonal_1.UploadFavs);
route.post("/removefav", GetAllPersonal_1.RemoveFavs);
route.post("/makeTrash", GetAllPersonal_1.makeTrash);
route.post("/removeTrash", GetAllPersonal_1.removeTrash);
route.post("/deleteP", GetAllPersonal_1.deletePFile);
route.post("/getallagroups", GetAllPersonal_1.getallagroups);
route.post("/getalluser", Protect_1.VerifyUser, GetAllPersonal_1.getalluser);
exports.default = route;
//# sourceMappingURL=personalRoutes.js.map