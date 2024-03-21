"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const personalRoutes_1 = __importDefault(require("./routes/personalRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/user", userRoutes_1.default);
app.use("/api/v1/personal", personalRoutes_1.default);
app.use("/api/v1/group", groupRoutes_1.default);
app.use("/api/v1/request", requestRoutes_1.default);
app.listen(4000, () => {
    console.log("Hello world");
});
//# sourceMappingURL=index.js.map