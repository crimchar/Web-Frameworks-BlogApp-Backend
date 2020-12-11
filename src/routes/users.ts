import express from 'express';
import path from 'path';
import { ErrorMessage } from '../models/error';
import {JWTAuth} from '../utils/jwtauth';
import bcrypt from 'bcrypt';
import { User, userArray } from '../models/userObj';
import { Post, postArray } from '../models/postObj';
const usersRouter = express.Router();



usersRouter.get('/Posts/:userId', (req,res,next)=>{
    let userPosts:Post[] = [];
    for(var i = 0; i < postArray.length; i++){
        if(postArray[i].userId === req.params.userId)
            userPosts.push(postArray[i]);
    }
    res.send(userPosts).status(200);
});

usersRouter.get('/:userId', (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        for(var i = 0; i < userArray.length; i++){
            if (userArray[i].userId === req.params.userId){
                res.status(200).send(userArray[i]);
                console.log(userArray[i]);
                break;
            }
            else{
                res.status(404).send(new ErrorMessage(404, 'User not Found'));
            }
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});

usersRouter.get("/:userId/:password", (req,res,next)=>{

    let foundUser = userArray.filter(u=>u.userId===req.params.userId);

    if(foundUser.length>0)
    {
        foundUser[0].validatePassword(req.params.password).then((validPwd)=>
        {
            if(validPwd)
            {
                let token = JWTAuth.GenerateWebToken(foundUser[0])
                res.status(200).send({token:token});
            }
            else
            {
                res.status(401).send(new ErrorMessage(401,'Invalid Username or Password'));
            }
        }).catch((e: any)=>{
            console.log(e);
        });
    }
    else
        res.status(404).send(new ErrorMessage(404, 'User not found'));
});

usersRouter.post("/", (req,res,next)=>{
    let currentUser = User.ToUser(req.body);
    if(currentUser instanceof User)
    {
        if(userArray.find(i => i.userId === req.body.userId)){
            res.status(409).send(new ErrorMessage(409, 'That user already exists'));
        }
        else{
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
           if(User.validateEmail(currentUser.emailAddress))
           {
               currentUser.setPassword(req.body.password);
               userArray[userArray.length] = currentUser;
               res.status(201).send(currentUser)
           }
           else
            res.status(406).send(new ErrorMessage(406, 'Invalid Email Address'));
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, 'Malformed User Data received'));
});

usersRouter.patch("/:userId", (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        for(var i = 0; i < userArray.length; i++){
            if (userArray[i].userId === req.params.userId){
                if ((req.body.userId !== "" && req.body.userId !== undefined)&&(req.body.firstName !== "" && req.body.firstName !== undefined)&&(req.body.lastName !== "" && req.body.lastName !== undefined)&&(req.body.emailAddress !== "" && req.body.emailAddress !== undefined)&&(req.body.password !== "" && req.body.password !== undefined)){
                    if(User.validateEmail(req.body.emailAddress))
                    {
                        userArray[i].firstName = req.body.firstName;
                        userArray[i].lastName = req.body.lastName;
                        userArray[i].emailAddress = req.body.emailAddress;
                        userArray[i].setPassword(req.body.password);
                        res.status(200).send(userArray[i]);
                        console.log(userArray[i]);
                        break;
                    }
                    else
                        res.status(406).send(new ErrorMessage(406, 'Invalid Email Address'));
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
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});

usersRouter.delete('/:userId', (req,res,next)=>{

    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        for(var i = 0; (i < userArray.length) && (userArray[i].userId === req.params.userId); i++){
            if (userArray[i].userId === req.params.userId){
                console.log(userArray[i]);
                userArray.splice(i, 1);
                res.sendStatus(204);
                break;
            }
            else{
                res.status(404).send(new ErrorMessage(404, 'That user cannot be deleted because they do not exist'));
            }
        }
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
});



usersRouter.get("/", (req,res,next)=>{
    let currentUser = JWTAuth.VerifyToken(req.headers);
    if(currentUser instanceof User)
    {
        res.send(userArray).status(200);
    }
    else
        res.status(401).send(new ErrorMessage(401, currentUser));
})


export {usersRouter};