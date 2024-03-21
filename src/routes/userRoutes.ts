import {Router} from "express";
import {GetAdminMemberData, register, userInfo} from "../controllers/RegisterController";
import {VerifyUser} from "../middleware/Protect";

const route = Router();

route.post("", register);

route.post("/getuser", VerifyUser, userInfo);
route.post("/getadminmember", GetAdminMemberData);

export default route;
