import express from 'express';
import path from 'path';
import { ErrorMessage } from '../models/error';
//import {JWTAuth} from '../utils/jwtauth';
//import bcrypt from 'bcrypt';
import { Post, postArray } from '../models/postObj';
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
    if(req.body.title != "" && req.body.content != ""){
        let newNum = postArray.length + 1;
        let newDate = new Date();
        let newPost = new Post(newNum, newDate, req.body.title, req.body.content, req.body.userId, req.body.headerImage, newDate);
        postArray.push(newPost);
        res.status(201).send(newPost);
    }
    else{
        res.status(400).send(new ErrorMessage(400, 'You are missing a field'));
    }
});

postsRouter.patch("/:postId", (req,res,next)=>{

    for(var i = 0; i < postArray.length; i++){
        if (postArray[i].postId === +req.params.postId){
            if (req.body.title != "" && req.body.content != ""){
                let newDate = new Date();
                postArray[i].title = req.body.title;
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
            res.status(404).send(new ErrorMessage(404, 'That user ID is not present, cannot patch'));
        }
    }
    
});

postsRouter.delete('/:postId', (req,res,next)=>{

    for(var i = 0; i < postArray.length; i++){
        if (postArray[i].postId === +req.params.postId){
            postArray.splice(i, 1);
            res.sendStatus(200);
            break;
        }
        else{
            res.status(404).send(new ErrorMessage(404, 'That post cannot be deleted because it does not exist'));
        }
    }
});

postsRouter.get("/", (req,res,next)=>{
    //res.sendFile(path.join(process.cwd(),'views','help.html'));
    res.send(postArray).status(200);
})









export {postsRouter};