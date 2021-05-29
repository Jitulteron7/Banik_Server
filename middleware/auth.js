const asyncHandler = require("express-async-handler");
const AdminAuthService = require("../service/AdminAuthService");


const adminAuthService = new AdminAuthService();

var auth = asyncHandler(async (req, res, next) => {
        try{
            req.token = req.header("Authorization").replace("Bearer ", "");
            req.admin = await adminAuthService.checkAuthToken(req.token);  
            next();
        } catch(err){
             err = new Error("Authentication middleware error ");
             err.statusCode = 401;
             err.name = "Unable to authorize";
            throw err
        }
        
});

module.exports = auth;
