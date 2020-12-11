"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = require("../models/error");
const postObj_1 = require("../models/postObj");
const jwtauth_1 = require("../utils/jwtauth");
const userObj_1 = require("../models/userObj");
const postsRouter = express_1.default.Router();
exports.postsRouter = postsRouter;
postsRouter.get('/:postId', (req, res, next) => {
    for (var i = 0; i < postObj_1.postArray.length; i++) {
        if (postObj_1.postArray[i].postId === +req.params.postId) {
            res.status(200).send(postObj_1.postArray[i]);
            break;
        }
        else {
            res.status(404).send(new error_1.ErrorMessage(404, 'Post not Found'));
        }
    }
});
postsRouter.post("/", (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        if ((req.body.title !== "" && req.body.title !== undefined) && (req.body.content !== "" && req.body.content !== undefined)) {
            let newNum = postObj_1.postArray.length + 1;
            let newDate = new Date();
            let newPost = new postObj_1.Post(newNum, newDate, req.body.title, req.body.content, currentUser.userId, req.body.headerImage, newDate);
            postObj_1.postArray.push(newPost);
            res.status(201).send(newPost);
        }
        else {
            res.status(400).send(new error_1.ErrorMessage(400, 'You are missing a field'));
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
postsRouter.patch("/:postId", (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        for (var i = 0; i < postObj_1.postArray.length; i++) {
            if ((postObj_1.postArray[i].postId === +req.params.postId) && (postObj_1.postArray[i].userId === currentUser.userId)) {
                if ((req.body.content !== "" && req.body.content !== undefined)) {
                    let newDate = new Date();
                    postObj_1.postArray[i].content = req.body.content;
                    postObj_1.postArray[i].headerImage = req.body.headerImage;
                    postObj_1.postArray[i].lastUpdated = newDate;
                    res.status(200).send(postObj_1.postArray[i]);
                    break;
                }
                else {
                    res.status(400).send(new error_1.ErrorMessage(400, 'You are missing a field'));
                    break;
                }
            }
            else {
                res.status(404).send(new error_1.ErrorMessage(404, 'That post ID is not present, or this post does not belong to you'));
            }
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
postsRouter.delete('/:postId', (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        for (var i = 0; (i < postObj_1.postArray.length) && (postObj_1.postArray[i].postId === +req.params.postId); i++) {
            if ((postObj_1.postArray[i].postId === +req.params.postId) && (postObj_1.postArray[i].userId === currentUser.userId)) {
                postObj_1.postArray.splice(i, 1);
                res.sendStatus(204);
                break;
            }
            else {
                res.status(404).send(new error_1.ErrorMessage(404, 'That post cannot be deleted because it does not exist or this post does not belong to you'));
            }
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
postsRouter.get("/", (req, res, next) => {
    res.send(postObj_1.postArray).status(200);
});
//# sourceMappingURL=posts.js.map