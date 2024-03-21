"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Protect_1 = require("../middleware/Protect");
const RequestController_1 = require("../controllers/RequestController");
const router = (0, express_1.Router)();
router.post("/add", Protect_1.VerifyUser, RequestController_1.AddRequest);
router.post("/getall", Protect_1.VerifyUser, RequestController_1.GetAll);
router.post("/acceptreq", Protect_1.VerifyUser, RequestController_1.AcceptReq);
router.post("/declinereq", Protect_1.VerifyUser, RequestController_1.DeclineReq);
exports.default = router;
//# sourceMappingURL=requestRoutes.js.map