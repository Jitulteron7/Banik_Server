let mongoose = require("mongoose");
let bcrypt=require("bcrypt");
let AdminSchema = new mongoose.Schema({
  fname:{
      type:String,
      
  },
  lname:{
      type:String,
      
  },
  profit:{
      type:Number,
      default:0,
  },
  email:{
      type:String,
      required:true,
      unique:true
  },
  password:{
      type:String,
      required:true,
  },
  profile:{
      type:Buffer
  }
  
});

AdminSchema.pre("save", async function (next) {
    var admin = this;
    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

const AdminModel = mongoose.model("Admin", AdminSchema);

module.exports = AdminModel;
