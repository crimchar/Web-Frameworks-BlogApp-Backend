import express from 'express';
import path from 'path';
import { ErrorMessage } from '../models/error';
//import {JWTAuth} from '../utils/jwtauth';
import bcrypt from 'bcrypt';
import { Category, categoryArray } from '../models/categoryObj';
import { JWTAuth } from '../utils/jwtauth';
import { User } from '../models/userObj';
const categoriesRouter = express.Router();

categoriesRouter.get('/:categoryId', (req,res,next)=>{

    for(var i = 0; i < categoryArray.length; i++){
        if (categoryArray[i].categoryId === +req.params.categoryId){
            res.status(200).send(categoryArray[i]);
            break;
        }
        else{
            res.status(404).send(new ErrorMessage(404, 'Category not Found'));
        }
    }
});

categoriesRouter.post("/", (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        if((req.body.categoryName !== "" && req.body.categoryName !== undefined)&&(req.body.categoryDescription !== "" && req.body.categoryDescription !== undefined)){
            let newNum = categoryArray.length + 1;
            let newCategory = new Category(newNum, req.body.categoryName, req.body.categoryDescription);
            categoryArray.push(newCategory);
            res.status(201).send(newCategory);
        }
        else{
            res.status(400).send(new ErrorMessage(400, 'You are missing a field'));
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});

categoriesRouter.patch("/:categoryId", (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        for(var i = 0; i < categoryArray.length; i++){
            if (categoryArray[i].categoryId === +req.params.categoryId){
                if ((req.body.categoryName !== "" && req.body.categoryName !== undefined)&&(req.body.categoryDescription !== "" && req.body.categoryDescription !== undefined)){
                    categoryArray[i].categoryName = req.body.categoryName;
                    categoryArray[i].categoryDescription = req.body.categoryDescription;
                    res.status(200).send(categoryArray[i]);
                    break;
                }
                else{
                    res.status(400).send(new ErrorMessage(400, 'You are missing a field'));
                    break;
                }
            }
            else{
                res.status(404).send(new ErrorMessage(404, 'That category ID is not present, cannot patch'));
            }
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
    
});

categoriesRouter.delete('/:categoryId', (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        for(var i = 0; (i < categoryArray.length) && (categoryArray[i].categoryId === +req.params.categoryId); i++){
            if (categoryArray[i].categoryId === +req.params.categoryId){
                categoryArray.splice(i, 1);
                res.sendStatus(204);
                break;
            }
            else{
                res.status(404).send(new ErrorMessage(404, 'That category cannot be deleted because it does not exist'));
            }
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});

categoriesRouter.get("/", (req,res,next)=>{
    res.send(categoryArray).status(200);
})

export {categoriesRouter};