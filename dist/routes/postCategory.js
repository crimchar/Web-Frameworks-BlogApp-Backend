"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCategoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = require("../models/error");
const postCategoryObj_1 = require("../models/postCategoryObj");
const jwtauth_1 = require("../utils/jwtauth");
const userObj_1 = require("../models/userObj");
const postObj_1 = require("../models/postObj");
const categoryObj_1 = require("../models/categoryObj");
const postCategoryRouter = express_1.default.Router();
exports.postCategoryRouter = postCategoryRouter;
postCategoryRouter.get('/:postId', (req, res, next) => {
    let foundPost = postCategoryObj_1.postCategoryArray.filter(p => p.postId === +req.params.postId);
    if (foundPost.length > 0) {
        let foundCategories = [];
        for (let i = 0; i < foundPost.length; i++) {
            let listCategory = categoryObj_1.categoryArray.filter(c => c.categoryId === foundPost[i].categoryId);
            let foundCategory = listCategory[0];
            foundCategories.push(foundCategory);
        }
        let categoriesList = new postCategoryObj_1.PostResponse(+req.params.postId, foundCategories);
        res.send(categoriesList).status(200);
    }
});
postCategoryRouter.get("/Posts/:categoryId", (req, res, next) => {
    let foundCategory = postCategoryObj_1.postCategoryArray.filter(p => p.categoryId === +req.params.categoryId);
    if (foundCategory.length > 0) {
        let foundPosts = [];
        for (let i = 0; i < foundCategory.length; i++) {
            let listPost = postObj_1.postArray.filter(p => p.postId === foundCategory[i].postId);
            let foundPost = listPost[0];
            foundPosts.push(foundPost);
        }
        let postsList = new postCategoryObj_1.CategoryResponse(+req.params.categoryId, foundPosts);
        res.send(postsList).status(200);
    }
});
postCategoryRouter.post("/:postId/:categoryId", (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        let foundPost = postObj_1.postArray.filter(p => p.postId === +req.params.postId);
        let foundCategory = categoryObj_1.categoryArray.filter(c => c.categoryId === +req.params.categoryId);
        if (foundPost.length > 0 && foundCategory.length > 0) {
            if (foundPost[0].userId !== currentUser.userId) {
                res.status(400).send(new error_1.ErrorMessage(400, 'This post does not belong to you'));
            }
            let newPostCategory = new postCategoryObj_1.PostCategory(foundPost[0].postId, foundCategory[0].categoryId);
            postCategoryObj_1.postCategoryArray.push(newPostCategory);
            res.status(201).send(newPostCategory);
        }
        else
            res.status(404).send(new error_1.ErrorMessage(404, 'The post or category you are looking for does not exist'));
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
postCategoryRouter.delete('/:postId/:categoryId', (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        let foundPost = postObj_1.postArray.filter(p => p.postId === +req.params.postId);
        let foundCategory = categoryObj_1.categoryArray.filter(c => c.categoryId === +req.params.categoryId);
        if (foundPost.length > 0 && foundCategory.length > 0) {
            if (foundPost[0].userId !== currentUser.userId) {
                res.status(400).send(new error_1.ErrorMessage(400, 'This post does not belong to you'));
            }
            for (var i = 0; i < postCategoryObj_1.postCategoryArray.length; i++) {
                if ((postCategoryObj_1.postCategoryArray[i].postId === foundPost[0].postId) && (postCategoryObj_1.postCategoryArray[i].categoryId === foundCategory[0].categoryId)) {
                    postCategoryObj_1.postCategoryArray.splice(i, 1);
                    res.sendStatus(204);
                    break;
                }
            }
        }
        else
            res.status(404).send(new error_1.ErrorMessage(404, 'The post or category you are looking for does not exist'));
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
//# sourceMappingURL=postCategory.js.map