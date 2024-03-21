"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RegisterController_1 = require("../controllers/RegisterController");
const Protect_1 = require("../middleware/Protect");
const route = (0, express_1.Router)();
route.post("", RegisterController_1.register);
route.post("/getuser", Protect_1.VerifyUser, RegisterController_1.userInfo);
route.post("/getadminmember", RegisterController_1.GetAdminMemberData);
exports.default = route;
//# sourceMappingURL=userRoutes.js.map