import bcrypt from 'bcrypt';

class User
{
    userId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;

    constructor(userId:string, firstName:string, lastName:string, emailAddress:string, password:string){
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = '';
    }

    static ToUser(obj:any):User|boolean
    {
        return Object.hasOwnProperty.bind(obj)('userId') && Object.hasOwnProperty.bind(obj)('firstName') && Object.hasOwnProperty.bind(obj)('lastName') && Object.hasOwnProperty.bind(obj)('emailAddress') ? new User(obj.userId, obj.firstName, obj.lastName, obj.emailAddress, '') : false;
    }

    setPassword(password:string)
    {
        bcrypt.hash(password,10, (err,hash)=>{
            this.password = hash;
        });
    }

    validatePassword(password:string)
    {
        return bcrypt.compare(password, this.password);
    }

    static validateEmail(email:string)
    {
        let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regexp.test(email);
    }

}

const userArray:User[]=[]

export {User};
let GalbalSalt = '';
export {userArray, GalbalSalt};