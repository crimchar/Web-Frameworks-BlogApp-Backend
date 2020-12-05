"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const userObj_1 = require("../models/userObj");
const usersRouter = express_1.default.Router();
exports.usersRouter = usersRouter;
usersRouter.get("/Users", (reg, res, next) => {
    res.send(userObj_1.userArray).status(200);
});
usersRouter.get("/", (req, res, next) => {
    res.sendFile(path_1.default.join(process.cwd(), 'views', 'help.html'));
});
//# sourceMappingURL=users.js.map