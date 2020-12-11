"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = require("../models/error");
const categoryObj_1 = require("../models/categoryObj");
const jwtauth_1 = require("../utils/jwtauth");
const userObj_1 = require("../models/userObj");
const categoriesRouter = express_1.default.Router();
exports.categoriesRouter = categoriesRouter;
categoriesRouter.get('/:categoryId', (req, res, next) => {
    for (var i = 0; i < categoryObj_1.categoryArray.length; i++) {
        if (categoryObj_1.categoryArray[i].categoryId === +req.params.categoryId) {
            res.status(200).send(categoryObj_1.categoryArray[i]);
            break;
        }
        else {
            res.status(404).send(new error_1.ErrorMessage(404, 'Category not Found'));
        }
    }
});
categoriesRouter.post("/", (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        if ((req.body.categoryName !== "" && req.body.categoryName !== undefined) && (req.body.categoryDescription !== "" && req.body.categoryDescription !== undefined)) {
            let newNum = categoryObj_1.categoryArray.length + 1;
            let newCategory = new categoryObj_1.Category(newNum, req.body.categoryName, req.body.categoryDescription);
            categoryObj_1.categoryArray.push(newCategory);
            res.status(201).send(newCategory);
        }
        else {
            res.status(400).send(new error_1.ErrorMessage(400, 'You are missing a field'));
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
categoriesRouter.patch("/:categoryId", (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        for (var i = 0; i < categoryObj_1.categoryArray.length; i++) {
            if (categoryObj_1.categoryArray[i].categoryId === +req.params.categoryId) {
                if ((req.body.categoryName !== "" && req.body.categoryName !== undefined) && (req.body.categoryDescription !== "" && req.body.categoryDescription !== undefined)) {
                    categoryObj_1.categoryArray[i].categoryName = req.body.categoryName;
                    categoryObj_1.categoryArray[i].categoryDescription = req.body.categoryDescription;
                    res.status(200).send(categoryObj_1.categoryArray[i]);
                    break;
                }
                else {
                    res.status(400).send(new error_1.ErrorMessage(400, 'You are missing a field'));
                    break;
                }
            }
            else {
                res.status(404).send(new error_1.ErrorMessage(404, 'That category ID is not present, cannot patch'));
            }
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
categoriesRouter.delete('/:categoryId', (req, res, next) => {
    let currentUser = jwtauth_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof userObj_1.User) {
        for (var i = 0; (i < categoryObj_1.categoryArray.length) && (categoryObj_1.categoryArray[i].categoryId === +req.params.categoryId); i++) {
            if (categoryObj_1.categoryArray[i].categoryId === +req.params.categoryId) {
                categoryObj_1.categoryArray.splice(i, 1);
                res.sendStatus(204);
                break;
            }
            else {
                res.status(404).send(new error_1.ErrorMessage(404, 'That category cannot be deleted because it does not exist'));
            }
        }
    }
    else
        res.status(401).send(new error_1.ErrorMessage(401, currentUser));
});
categoriesRouter.get("/", (req, res, next) => {
    res.send(categoryObj_1.categoryArray).status(200);
});
//# sourceMappingURL=categories.js.map