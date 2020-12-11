"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalbalSalt = exports.userArray = exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class User {
    constructor(userId, firstName, lastName, emailAddress, password) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = '';
    }
    static ToUser(obj) {
        return Object.hasOwnProperty.bind(obj)('userId') && Object.hasOwnProperty.bind(obj)('firstName') && Object.hasOwnProperty.bind(obj)('lastName') && Object.hasOwnProperty.bind(obj)('emailAddress') ? new User(obj.userId, obj.firstName, obj.lastName, obj.emailAddress, '') : false;
    }
    setPassword(password) {
        bcrypt_1.default.hash(password, 10, (err, hash) => {
            this.password = hash;
        });
    }
    validatePassword(password) {
        return bcrypt_1.default.compare(password, this.password);
    }
    static validateEmail(email) {
        let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regexp.test(email);
    }
}
exports.User = User;
const userArray = [];
exports.userArray = userArray;
let GalbalSalt = '';
exports.GalbalSalt = GalbalSalt;
//# sourceMappingURL=userObj.js.map