import express from 'express';
import path from 'path';
import { ErrorMessage } from '../models/error';
import bcrypt from 'bcrypt';
import { JWTAuth } from '../utils/jwtauth';
import { User } from '../models/userObj';
import { Post, postArray } from '../models/postObj';
import { Comment, commentArray } from '../models/commentObj';
const commentsRouter = express.Router();

commentsRouter.get('/:postId/:commentId', (req,res,next)=>{

    let foundPost = postArray.filter(p=>p.postId===+req.params.postId);
    let foundComment = commentArray.filter(c=>c.commentId===+req.params.commentId);
    if(foundPost.length>0 && foundComment.length>0)
    {
        if(foundPost[0].postId === foundComment[0].postId)
            res.status(200).send(foundComment[0]);
    }
    else
        res.status(404).send(new ErrorMessage(404, 'The post or comment you are looking for does not exist')); 

});

commentsRouter.get("/:postId", (req,res,next)=>{
    
    let foundComments = commentArray.filter(c=>c.postId===+req.params.postId);
    let foundPost = postArray.filter(p=>p.postId === + req.params.postId)
    if(foundPost.length = 0)
    {
        res.status(404).send(new ErrorMessage(404, 'The post you are looking for does not exist')); 
    }
    else
        res.send(foundComments).status(200);
});

commentsRouter.post("/:postId", (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {

        let foundPost = postArray.filter(p=>p.postId===+req.params.postId);

        if(foundPost.length>0)
        {
            if(req.body.comment!=='' && req.body.comment!==undefined){
                let newId = commentArray.length + 1
                let newDate = new Date();
                let newComment = new Comment(newId, req.body.comment, currentUser.userId, +req.params.postId, newDate);
                commentArray.push(newComment);
                res.status(201).send(newComment);
            }

        }
        else
            res.status(404).send(new ErrorMessage(404, 'The post you are looking for does not exist'));
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});

commentsRouter.patch('/:postId/:commentId', (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {

        let foundPost = postArray.filter(p=>p.postId===+req.params.postId);
        let foundComment = commentArray.filter(c=>c.commentId===+req.params.commentId);

        if(foundPost.length>0 && foundComment.length>0 && foundComment[0].userId === currentUser.userId)
        {
            if(req.body.comment!=='' && req.body.comment!==undefined){
                for(let i = 0; i < commentArray.length; i++)
                {
                    if(commentArray[i].commentId === +foundComment[0].commentId)
                    {
                        commentArray[i].comment = req.body.comment;
                        res.status(200).send(commentArray[i]);
                    }
                }
            }
        }
        else
            res.status(404).send(new ErrorMessage(404, 'The post you are looking for does not exist, or this post does not belong to you'));
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});


commentsRouter.delete('/:postId/:commentId', (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {

        let foundPost = postArray.filter(p=>p.postId===+req.params.postId);
        let foundComment = commentArray.filter(c=>c.commentId===+req.params.commentId);

        if(foundPost.length>0 && foundComment.length>0)
        {
            if(foundPost[0].userId!==currentUser.userId || foundComment[0].userId!==currentUser.userId){
                res.status(400).send(new ErrorMessage(400,'This post or comment does not belong to you'));
            }
            for(var i = 0; i < commentArray.length; i++)
            {
                if(commentArray[i].commentId === +req.params.commentId)
                {
                    commentArray.splice(i,1);
                    res.sendStatus(204);
                    break;
                }
            }
        }
        else
            res.status(404).send(new ErrorMessage(404, 'The post or comment you are looking for does not exist'));
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});



export {commentsRouter};