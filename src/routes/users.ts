import express from 'express';
import path from 'path';
import { ErrorMessage } from '../models/error';
//import {JWTAuth} from '../utils/jwtauth';
//import bcrypt from 'bcrypt';
import { User, userArray } from '../models/userObj';
const usersRouter = express.Router();



usersRouter.get('/:userId', (req,res,next)=>{

    for(var i = 0; i < userArray.length; i++){
        if (userArray[i].userId === req.params.userId){
            res.status(200).send(userArray[i]);
            break;
        }
        else{
            res.status(404).send(new ErrorMessage(404, 'User not Found'));
        }
    }
});

usersRouter.post("/", (req,res,next)=>{
    if(userArray.find(i => i.userId === req.body.userId)){
        res.status(409).send(new ErrorMessage(409, 'That user already exists'));
    }
    else{
        if(req.body.userID != "" && req.body.fname != "" && req.body.lname != "" && req.body.email != "" && req.body.password != ""){
            let newUser = new User(req.body.userID, req.body.fname, req.body.lname, req.body.email, req.body.password);
            userArray.push(newUser);
            res.status(201).send(newUser);
        }
        else{
            res.status(400).send(new ErrorMessage(400, 'You are missing a field'));
        }
    }
});

usersRouter.patch("/:userId", (req,res,next)=>{

    for(var i = 0; i < userArray.length; i++){
        if (userArray[i].userId === req.params.userId){
            if (req.body.userID != "" && req.body.fname != "" && req.body.lname != "" && req.body.email != "" && req.body.password != ""){
                userArray[i].fname = req.body.fname;
                userArray[i].lname = req.body.lname;
                userArray[i].email = req.body.email;
                userArray[i].password = req.body.password;
                res.status(200).send(userArray[i]);
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

usersRouter.delete('/:userId', (req,res,next)=>{

    for(var i = 0; i < userArray.length; i++){
        if (userArray[i].userId === req.params.userId){
            userArray.splice(i, 1);
            res.sendStatus(200);
            break;
        }
        else{
            res.status(404).send(new ErrorMessage(404, 'That user cannot be deleted because they do not exist'));
        }
    }
});

usersRouter.get("/", (req,res,next)=>{
    //res.sendFile(path.join(process.cwd(),'views','help.html'));
    res.send(userArray).status(200);
})


export {usersRouter};