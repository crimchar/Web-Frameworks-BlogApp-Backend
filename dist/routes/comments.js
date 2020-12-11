"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = require("../models/error");
const jwtauth_1 = require("../utils/jwtauth");
const userObj_1 = require("../models/userObj");
const postObj_1 = require("../models/postObj");
const commentObj_1 = require("../models/commentObj");
const commentsRouter = express_1.default.Router();
exports.commentsRouter = commentsRouter;
commentsRouter.get('/:postId/:commentId', (req, res, next) => {
    let foundPost = postObj_1.postArray.filter(p => p.postId === +req.params.postId);
    let foundComment = commentObj_1.commentArray.filter(c => c.commentId === +req.params.commentId);
    if (foundPost.length > 0 && foundComment.length > 0) {
        if (foundPost[0].postId === foundComment[0].postId)
            res.status(200).send(foundComment[0]);
    }
    else
        res.status(404).send(new error_1.ErrorMessage(404, 'The post or comment you are looking for does not exist'));
});
commentsRouter.get("/:postId", (req, res, next) => {
    let foundComments = commentObj_1.commentArray.filter(c => c.postId === +req.params.postId);
    let foundPost = postObj_1.postArray.filter(p => p.postId === +req.params.postId);
    if (foundPost.length = 0) {
        res.status(404).send(new error_1.ErrorMessage(404, 'The post you are looking for does not exist'));
    }
    else
        res.send(foundComments).status(200);
});
commentsRouter.post("/:postId", (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        let foundPost = postObj_1.postArray.filter(p => p.postId === +req.params.postId);
        if (foundPost.length > 0) {
            if (req.body.comment !== '' && req.body.comment !== undefined) {
                let newId = commentObj_1.commentArray.length + 1;
                let newDate = new Date();
                let newComment = new commentObj_1.Comment(newId, req.body.comment, currentUser.userId, +req.params.postId, newDate);
                commentObj_1.commentArray.push(newComment);
                res.status(201).send(newComment);
            }
        }
        else
            res.status(404).send(new error_1.ErrorMessage(404, 'The post you are looking for does not exist'));
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
commentsRouter.patch('/:postId/:commentId', (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        let foundPost = postObj_1.postArray.filter(p => p.postId === +req.params.postId);
        let foundComment = commentObj_1.commentArray.filter(c => c.commentId === +req.params.commentId);
        if (foundPost.length > 0 && foundComment.length > 0 && foundComment[0].userId === currentUser.userId) {
            if (req.body.comment !== '' && req.body.comment !== undefined) {
                for (let i = 0; i < commentObj_1.commentArray.length; i++) {
                    if (commentObj_1.commentArray[i].commentId === +foundComment[0].commentId) {
                        commentObj_1.commentArray[i].comment = req.body.comment;
                        res.status(200).send(commentObj_1.commentArray[i]);
                    }
                }
            }
        }
        else
            res.status(404).send(new error_1.ErrorMessage(404, 'The post you are looking for does not exist, or this post does not belong to you'));
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
commentsRouter.delete('/:postId/:commentId', (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        let foundPost = postObj_1.postArray.filter(p => p.postId === +req.params.postId);
        let foundComment = commentObj_1.commentArray.filter(c => c.commentId === +req.params.commentId);
        if (foundPost.length > 0 && foundComment.length > 0) {
            if (foundPost[0].userId !== currentUser.userId || foundComment[0].userId !== currentUser.userId) {
                res.status(400).send(new error_1.ErrorMessage(400, 'This post or comment does not belong to you'));
            }
            for (var i = 0; i < commentObj_1.commentArray.length; i++) {
                if (commentObj_1.commentArray[i].commentId === +req.params.commentId) {
                    commentObj_1.commentArray.splice(i, 1);
                    res.sendStatus(204);
                    break;
                }
            }
        }
        else
            res.status(404).send(new error_1.ErrorMessage(404, 'The post or comment you are looking for does not exist'));
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
//# sourceMappingURL=comments.js.map