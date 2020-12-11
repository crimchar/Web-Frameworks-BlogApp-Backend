import express from 'express';
import path from 'path';
import { ErrorMessage } from '../models/error';
import bcrypt from 'bcrypt';
import { PostCategory, PostResponse, CategoryResponse, postCategoryArray } from '../models/postCategoryObj';
import { JWTAuth } from '../utils/jwtauth';
import { User } from '../models/userObj';
import { Post, postArray } from '../models/postObj';
import { Category, categoryArray } from '../models/categoryObj';
const postCategoryRouter = express.Router();

postCategoryRouter.get('/:postId', (req,res,next)=>{

    let foundPost = postCategoryArray.filter(p=>p.postId===+req.params.postId);
    if(foundPost.length>0)
    {
        let foundCategories:Category[] = [];
        for(let i = 0; i < foundPost.length; i++)
        {
            let listCategory = categoryArray.filter(c=>c.categoryId===foundPost[i].categoryId)
            let foundCategory = listCategory[0];
            foundCategories.push(foundCategory);
        }
        let categoriesList = new PostResponse(+req.params.postId, foundCategories);
        res.send(categoriesList).status(200);
    }

});

postCategoryRouter.get("/Posts/:categoryId", (req,res,next)=>{
    
    let foundCategory = postCategoryArray.filter(p=>p.categoryId===+req.params.categoryId);
    if(foundCategory.length>0)
    {
        let foundPosts:Post[] = [];
        for(let i = 0; i < foundCategory.length; i++)
        {
            let listPost = postArray.filter(p=>p.postId===foundCategory[i].postId)
            let foundPost = listPost[0];
            foundPosts.push(foundPost);
        }
        let postsList = new CategoryResponse(+req.params.categoryId, foundPosts);
        res.send(postsList).status(200);
    }
});

postCategoryRouter.post("/:postId/:categoryId", (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {

        let foundPost = postArray.filter(p=>p.postId===+req.params.postId);
        let foundCategory = categoryArray.filter(c=>c.categoryId===+req.params.categoryId);

        if(foundPost.length>0 && foundCategory.length>0)
        {
            if(foundPost[0].userId!==currentUser.userId){
                res.status(400).send(new ErrorMessage(400,'This post does not belong to you'));
            }
            let newPostCategory = new PostCategory(foundPost[0].postId, foundCategory[0].categoryId);
            postCategoryArray.push(newPostCategory);
            res.status(201).send(newPostCategory);
        }
        else
            res.status(404).send(new ErrorMessage(404, 'The post or category you are looking for does not exist'));
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});


postCategoryRouter.delete('/:postId/:categoryId', (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {

        let foundPost = postArray.filter(p=>p.postId===+req.params.postId);
        let foundCategory = categoryArray.filter(c=>c.categoryId===+req.params.categoryId);

        if(foundPost.length>0 && foundCategory.length>0)
        {
            if(foundPost[0].userId!==currentUser.userId){
                res.status(400).send(new ErrorMessage(400,'This post does not belong to you'));
            }
            for(var i = 0; i < postCategoryArray.length; i++)
            {
                if((postCategoryArray[i].postId===foundPost[0].postId)&&(postCategoryArray[i].categoryId===foundCategory[0].categoryId))
                {
                    postCategoryArray.splice(i,1);
                    res.sendStatus(204);
                    break;
                }
            }
        }
        else
            res.status(404).send(new ErrorMessage(404, 'The post or category you are looking for does not exist'));
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});



export {postCategoryRouter};