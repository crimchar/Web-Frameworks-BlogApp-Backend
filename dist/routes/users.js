"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = require("../models/error");
const jwtauth_1 = require("../utils/jwtauth");
const userObj_1 = require("../models/userObj");
const postObj_1 = require("../models/postObj");
const usersRouter = express_1.default.Router();
exports.usersRouter = usersRouter;
usersRouter.get('/Posts/:userId', (req, res, next) => {
    let userPosts = [];
    for (var i = 0; i < postObj_1.postArray.length; i++) {
        if (postObj_1.postArray[i].userId === req.params.userId)
            userPosts.push(postObj_1.postArray[i]);
    }
    res.send(userPosts).status(200);
});
usersRouter.get('/:userId', (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        for (var i = 0; i < userObj_1.userArray.length; i++) {
            if (userObj_1.userArray[i].userId === req.params.userId) {
                res.status(200).send(userObj_1.userArray[i]);
                console.log(userObj_1.userArray[i]);
                break;
            }
            else {
                res.status(404).send(new error_1.ErrorMessage(404, 'User not Found'));
            }
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
usersRouter.get("/:userId/:password", (req, res, next) => {
    let foundUser = userObj_1.userArray.filter(u => u.userId === req.params.userId);
    if (foundUser.length > 0) {
        foundUser[0].validatePassword(req.params.password).then((validPwd) => {
            if (validPwd) {
                let token = jwtauth_1.JWTAuth.GenerateWebToken(foundUser[0]);
                res.status(200).send({ token: token });
            }
            else {
                res.status(401).send(new error_1.ErrorMessage(401, 'Invalid Username or Password'));
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    else
        res.status(404).send(new error_1.ErrorMessage(404, 'User not found'));
});
usersRouter.post("/", (req, res, next) => {
    let currentUser = userObj_1.User.ToUser(req.body);
    if (currentUser instanceof userObj_1.User) {
        if (userObj_1.userArray.find(i => i.userId === req.body.userId)) {
            res.status(409).send(new error_1.ErrorMessage(409, 'That user already exists'));
        }
        else {
            /*
            if((req.body.userId !== "" && req.body.userId !== undefined)&&(req.body.firstName !== "" && req.body.firstName !== undefined)&&(req.body.lastName !== "" && req.body.lastName !== undefined)&&(req.body.emailAddress !== "" && req.body.emailAddress !== undefined)&&(req.body.password !== "" && req.body.password !== undefined)){
                let newUser = new User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
                userArray.push(newUser);
                res.status(201).send(newUser);
                console.log(newUser);
            }
            else{
                res.status(400).send(new ErrorMessage(400, 'You are missing a field'));
            }
            */
            if (userObj_1.User.validateEmail(currentUser.emailAddress)) {
                currentUser.setPassword(req.body.password);
                userObj_1.userArray[userObj_1.userArray.length] = currentUser;
                res.status(201).send(currentUser);
            }
            else
                res.status(406).send(new error_1.ErrorMessage(406, 'Invalid Email Address'));
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, 'Malformed User Data received'));
});
usersRouter.patch("/:userId", (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        for (var i = 0; i < userObj_1.userArray.length; i++) {
            if (userObj_1.userArray[i].userId === req.params.userId) {
                if ((req.body.userId !== "" && req.body.userId !== undefined) && (req.body.firstName !== "" && req.body.firstName !== undefined) && (req.body.lastName !== "" && req.body.lastName !== undefined) && (req.body.emailAddress !== "" && req.body.emailAddress !== undefined) && (req.body.password !== "" && req.body.password !== undefined)) {
                    if (userObj_1.User.validateEmail(req.body.emailAddress)) {
                        userObj_1.userArray[i].firstName = req.body.firstName;
                        userObj_1.userArray[i].lastName = req.body.lastName;
                        userObj_1.userArray[i].emailAddress = req.body.emailAddress;
                        userObj_1.userArray[i].setPassword(req.body.password);
                        res.status(200).send(userObj_1.userArray[i]);
                        console.log(userObj_1.userArray[i]);
                        break;
                    }
                    else
                        res.status(406).send(new error_1.ErrorMessage(406, 'Invalid Email Address'));
                }
                else {
                    res.status(400).send(new error_1.ErrorMessage(400, 'You are missing a field'));
                    break;
                }
            }
            else {
                res.status(404).send(new error_1.ErrorMessage(404, 'That user ID is not present, cannot patch'));
            }
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
usersRouter.delete('/:userId', (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        for (var i = 0; (i < userObj_1.userArray.length) && (userObj_1.userArray[i].userId === req.params.userId); i++) {
            if (userObj_1.userArray[i].userId === req.params.userId) {
                console.log(userObj_1.userArray[i]);
                userObj_1.userArray.splice(i, 1);
                res.sendStatus(204);
                break;
            }
            else {
                res.status(404).send(new error_1.ErrorMessage(404, 'That user cannot be deleted because they do not exist'));
            }
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
usersRouter.get("/", (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        res.send(userObj_1.userArray).status(200);
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
//# sourceMappingURL=users.js.map