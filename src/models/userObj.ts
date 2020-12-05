class User
{
    userId: string;
    fname: string;
    lname: string;
    email: string;
    password: string;

    constructor(userId:string, fname:string, lname:string, email:string, password:string){
        this.userId = userId;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.password = password;
    }

}

const userArray:User[]=[]

export {User};
export {userArray};