import express from 'express';
import path from 'path';
import { ErrorMessage } from '../models/error';
//import {JWTAuth} from '../utils/jwtauth';
import bcrypt from 'bcrypt';
import { Post, postArray } from '../models/postObj';
import { JWTAuth } from '../utils/jwtauth';
import { User } from '../models/userObj';
const postsRouter = express.Router();

postsRouter.get('/:postId', (req,res,next)=>{

    for(var i = 0; i < postArray.length; i++){
        if (postArray[i].postId === +req.params.postId){
            res.status(200).send(postArray[i]);
            break;
        }
        else{
            res.status(404).send(new ErrorMessage(404, 'Post not Found'));
        }
    }
});

postsRouter.post("/", (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        if((req.body.title !== "" && req.body.title !== undefined)&&(req.body.content !== "" && req.body.content !== undefined)){
            let newNum = postArray.length + 1;
            let newDate = new Date();
            let newPost = new Post(newNum, newDate, req.body.title, req.body.content, currentUser.userId, req.body.headerImage, newDate);
            postArray.push(newPost);
            res.status(201).send(newPost);
        }
        else{
            res.status(400).send(new ErrorMessage(400, 'You are missing a field'));
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});

postsRouter.patch("/:postId", (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        for(var i = 0; i < postArray.length; i++){
            if ((postArray[i].postId === +req.params.postId)&&(postArray[i].userId === currentUser.userId)){
                if ((req.body.content !== "" && req.body.content !== undefined)){
                    let newDate = new Date();
                    postArray[i].content = req.body.content;
                    postArray[i].headerImage = req.body.headerImage;
                    postArray[i].lastUpdated = newDate;
                    res.status(200).send(postArray[i]);
                    break;
                }
                else{
                    res.status(400).send(new ErrorMessage(400, 'You are missing a field'));
                    break;
                }
            }
            else{
                res.status(404).send(new ErrorMessage(404, 'That post ID is not present, or this post does not belong to you'));
            }
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
    
});

postsRouter.delete('/:postId', (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        for(var i = 0; (i < postArray.length) && (postArray[i].postId === +req.params.postId); i++){
            if ((postArray[i].postId === +req.params.postId)&&(postArray[i].userId === currentUser.userId)){
                postArray.splice(i, 1);
                res.sendStatus(204);
                break;
            }
            else{
                res.status(404).send(new ErrorMessage(404, 'That post cannot be deleted because it does not exist or this post does not belong to you'));
            }
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});

postsRouter.get("/", (req,res,next)=>{
    res.send(postArray).status(200);
})

export {postsRouter};