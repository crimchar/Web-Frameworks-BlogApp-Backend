"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userArray = exports.User = void 0;
class User {
    constructor(userID, fname, lname, email, password) {
        this.userID = userID;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.password = password;
    }
}
exports.User = User;
const userArray = [];
exports.userArray = userArray;
//# sourceMappingURL=userObj.js.map