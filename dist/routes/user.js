"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userObj_1 = require("../models/userObj");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post("/", (req, res, next) => {
    if (userObj_1.userArray.find(i => i.userID === req.body.userID)) {
        res.status(209).send('That user ID is already present');
    }
    else {
        if (req.body.userID != "" && req.body.fname != "" && req.body.lname != "" && req.body.email != "" && req.body.password != "") {
            let newUser = new userObj_1.User(req.body.userID, req.body.fname, req.body.lname, req.body.email, req.body.password);
            userObj_1.userArray.push(newUser);
            res.status(201).send(newUser);
        }
        else {
            res.status(400).send('You are missing a field');
        }
    }
});
userRouter.patch("/:ID", (req, res, next) => {
    for (var i = 0; i < userObj_1.userArray.length; i++) {
        if (userObj_1.userArray[i].userID === req.params.userID) {
            if (req.body.userID != "" && req.body.fname != "" && req.body.lname != "" && req.body.email != "" && req.body.password != "") {
                userObj_1.userArray[i].fname = req.body.fname;
                userObj_1.userArray[i].lname = req.body.lname;
                userObj_1.userArray[i].email = req.body.email;
                userObj_1.userArray[i].password = req.body.password;
                res.status(200).send(userObj_1.userArray[i]);
                break;
            }
            else {
                res.status(400).send('You are missing a field');
                break;
            }
        }
        else {
            res.status(404).send('That user ID is not present, cannot patch');
        }
    }
});
userRouter.delete('/:ID', (req, res, next) => {
    for (var i = 0; i < userObj_1.userArray.length; i++) {
        if (userObj_1.userArray[i].userID === req.params.ID) {
            userObj_1.userArray.splice(i, 1);
            res.sendStatus(200);
            break;
        }
        else {
            res.status(404).send('That user ID is not present, cannot delete');
        }
    }
});
userRouter.get('/:ID', (req, res, next) => {
    for (var i = 0; i < userObj_1.userArray.length; i++) {
        if (userObj_1.userArray[i].userID === req.params.ID) {
            res.status(200).send(userObj_1.userArray[i]);
            break;
        }
        else {
            res.status(404).send('That user ID is not present, cannot find');
        }
    }
});
//# sourceMappingURL=user.js.map