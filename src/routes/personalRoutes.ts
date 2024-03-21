import {Router} from "express";
import ExpressFormidable from "express-formidable";
import {UploadFileControl} from "../controllers/UploadController";
import {VerifyUser} from "../middleware/Protect";
import {GetAllFiles, RemoveFavs, UploadFavs, deletePFile, getallagroups, getalluser, makeTrash, removeTrash} from "../controllers/GetAllPersonal";

const route = Router();

route.post("/upload", ExpressFormidable(), UploadFileControl);
route.post("/getallfile", VerifyUser, GetAllFiles);
route.post("/makefav", UploadFavs);
route.post("/removefav", RemoveFavs);
route.post("/makeTrash", makeTrash);
route.post("/removeTrash", removeTrash);
route.post("/deleteP", deletePFile);

route.post("/getallagroups", getallagroups);
route.post("/getalluser", VerifyUser, getalluser);

export default route;
