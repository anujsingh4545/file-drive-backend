import {Router} from "express";
import {VerifyUser} from "../middleware/Protect";
import {AcceptReq, AddRequest, DeclineReq, GetAll} from "../controllers/RequestController";

const router = Router();

router.post("/add", VerifyUser, AddRequest);
router.post("/getall", VerifyUser, GetAll);
router.post("/acceptreq", VerifyUser, AcceptReq);
router.post("/declinereq", VerifyUser, DeclineReq);

export default router;
