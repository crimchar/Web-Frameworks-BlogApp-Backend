//CLASS CREATED BY JOSE GOMEZ

import express from 'express';
import { IncomingHttpHeaders } from 'http';
import { User, userArray } from '../models/userObj';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class JWTAuth
{
    static salt = bcrypt.genSaltSync(10);

    static VerifyToken(headers: IncomingHttpHeaders): User|string
    {
       if(headers.authorization && headers.authorization.split(' ')[0]==='Bearer')
       {
           try
           {
                let user = jwt.verify(headers.authorization.split(' ')[1],JWTAuth.salt) as any;
                if(user.UserData)
                {
                    let currentUser = User.ToUser(user.UserData)
                    if(currentUser instanceof User)
                    {
                        if(userArray.find(u=>u.userId===(<User>currentUser).userId))
                            return currentUser;
                        else
                            throw `Invalid user ${(<User>currentUser).userId}`;
                    }
                    else
                        throw 'Malformed User Data in JWT'
                }
                else
                    throw 'Malformed User Data in JWT'
           }
           catch(ex)
           {
               return ex.toString();
           }
       }
       else
        return 'Invalid Authorization Header';
    }

    static GenerateWebToken(user: User)
    {
        console.log(user);
        let token = jwt.sign({UserData:user},JWTAuth.salt,{expiresIn:1200, subject:user.userId});
        console.log(token);
        return token;
    }

}