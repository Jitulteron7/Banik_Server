const jwt =require("jsonwebtoken");

class adminAuthService {

    constructor(){

    }

    _toJSON(worker) {
        const workerObj = worker.toObject();
        return workerObj;
    }
    

    async checkAuthToken(token) {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            const err = new Error("Unauthorized");
            err.statusCode = 401;
            err.name = "Unauthorized";
            throw err;
        }
        return decoded;
    }

    async _generateAuthToken() {

        const token = jwt.sign(
            { firstname:process.env.firstname },
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRE}
        );
        
        return token;
    }

    async login(email,password) {

        if(email!==process.env.email){

            const err = new Error("Email is invalid");
            err.statusCode = 401;
            err.name = "Unauthorized";
            throw err;
        }

        if(password!==process.env.password){

            const err = new Error("Password is invalid");
            err.statusCode = 401;
            err.name = "Unauthorized";
            throw err;
        }

        const token = await this._generateAuthToken();
        
        const adminInfo={
            email: process.env.email,
            image:"",
            phone:process.env.phone,
            firstname:process.env.firstname,
            lastname:process.env.lastname
        }
        
        return {admin:adminInfo,token}
    }

    async logout() {
        const message="logout successfully";
        return message
    }

    async forgotpassword(email) {
        const user = await this._UserModel.findOne({ email });

        if (!user) {
            const err = new Error("Enter email once again");
            err.statusCode = 404;
            err.name = "NoEmail";
            throw err;
        }
        const token = this._generateForgotPasswordToken(user);
        await this._MailService.sendForgotPasswordMail(user, token);
    }
 
    // async resetpassword(id, token, password) {
    //     const user = await this._UserModel.findById(id);
    //     if (!user) {
    //         const err = new Error("No Such User");
    //         err.statusCode = 404;
    //         err.name = "NotFound";
    //         throw err;
    //     }
    //     this._checkResetToken(user._id, token);
    //     user.password = password;
    //     await user.save();
    //     return this._toJSON(user);
    // }
}

module.exports=adminAuthService;

