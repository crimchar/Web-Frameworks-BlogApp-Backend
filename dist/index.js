"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const users_1 = require("./routes/users");
const user_1 = require("./routes/user");
let app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
app.use('/user', user_1.userRouter);
app.use(users_1.usersRouter);
app.listen(3000);
//# sourceMappingURL=index.js.map