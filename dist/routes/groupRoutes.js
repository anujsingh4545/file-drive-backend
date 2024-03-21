"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Protect_1 = require("../middleware/Protect");
const GroupController_1 = require("../controllers/GroupController");
const express_formidable_1 = __importDefault(require("express-formidable"));
const route = (0, express_1.Router)();
route.post("/create", Protect_1.VerifyUser, GroupController_1.CreateGroup);
route.post("/delete", Protect_1.VerifyUser, GroupController_1.DeleteGroup);
route.post("/getallfile", Protect_1.VerifyUser, GroupController_1.GetAllFile);
route.post("/upload", (0, express_formidable_1.default)(), GroupController_1.UploadFileControl);
route.post("/makefav", GroupController_1.UploadFavs);
route.post("/removefav", GroupController_1.RemoveFavs);
route.post("/makeTrash", GroupController_1.makeTrash);
route.post("/removeTrash", GroupController_1.removeTrash);
route.post("/deleteP", GroupController_1.deletePFile);
route.post("/getmembers", Protect_1.VerifyUser, GroupController_1.GetAllMembers);
route.post("/changerole", Protect_1.VerifyUser, GroupController_1.ChangeRole);
route.post("/deleteuser", Protect_1.VerifyUser, GroupController_1.DeleteUser);
route.post("/deletemember", Protect_1.VerifyUser, GroupController_1.DeleteMember);
exports.default = route;
//# sourceMappingURL=groupRoutes.js.map