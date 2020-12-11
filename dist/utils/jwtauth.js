"use strict";
//CLASS CREATED BY JOSE GOMEZ
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuth = void 0;
const userObj_1 = require("../models/userObj");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class JWTAuth {
    static VerifyToken(headers) {
        if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
            try {
                let user = jsonwebtoken_1.default.verify(headers.authorization.split(' ')[1], JWTAuth.salt);
                if (user.UserData) {
                    let currentUser = userObj_1.User.ToUser(user.UserData);
                    if (currentUser instanceof userObj_1.User) {
                        if (userObj_1.userArray.find(u => u.userId === currentUser.userId))
                            return currentUser;
                        else
                            throw `Invalid user ${currentUser.userId}`;
                    }
                    else
                        throw 'Malformed User Data in JWT';
                }
                else
                    throw 'Malformed User Data in JWT';
            }
            catch (ex) {
                return ex.toString();
            }
        }
        else
            return 'Invalid Authorization Header';
    }
    static GenerateWebToken(user) {
        console.log(user);
        let token = jsonwebtoken_1.default.sign({ UserData: user }, JWTAuth.salt, { expiresIn: 1200, subject: user.userId });
        console.log(token);
        return token;
    }
}
exports.JWTAuth = JWTAuth;
JWTAuth.salt = bcrypt_1.default.genSaltSync(10);
//# sourceMappingURL=jwtauth.js.map