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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const VerifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const temp = req.headers["authorization"];
    if (!temp) {
        return res.status(400).send({
            messsage: "no token found",
            stats: false,
        });
    }
    const token = temp.split(" ")[1];
    try {
        const verify = jsonwebtoken_1.default.verify(token, process.env.JWTSECRET);
        if (!verify || typeof verify == "string") {
            return res.status(400).send({
                message: "verification failed",
                success: false,
            });
        }
        req.body.userId = verify.id;
        next();
    }
    catch (error) {
        return res.status(400).send({
            message: "Something went wrong",
            success: false,
        });
    }
});
exports.VerifyUser = VerifyUser;
//# sourceMappingURL=Protect.js.map