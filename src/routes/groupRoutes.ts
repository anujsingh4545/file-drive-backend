import {Router} from "express";
import {VerifyUser} from "../middleware/Protect";
import {ChangeRole, CreateGroup, DeleteGroup, DeleteMember, DeleteUser, GetAllFile, GetAllMembers, RemoveFavs, UploadFavs, UploadFileControl, deletePFile, makeTrash, removeTrash} from "../controllers/GroupController";
import ExpressFormidable from "express-formidable";

const route = Router();

route.post("/create", VerifyUser, CreateGroup);
route.post("/delete", VerifyUser, DeleteGroup);
route.post("/getallfile", VerifyUser, GetAllFile);
route.post("/upload", ExpressFormidable(), UploadFileControl);

route.post("/makefav", UploadFavs);
route.post("/removefav", RemoveFavs);
route.post("/makeTrash", makeTrash);
route.post("/removeTrash", removeTrash);
route.post("/deleteP", deletePFile);

route.post("/getmembers", VerifyUser, GetAllMembers);
route.post("/changerole", VerifyUser, ChangeRole);
route.post("/deleteuser", VerifyUser, DeleteUser);
route.post("/deletemember", VerifyUser, DeleteMember);

export default route;
