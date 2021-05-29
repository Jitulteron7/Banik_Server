let mongoose = require("mongoose");

let AdminSchema = new mongoose.Schema({
  fname:{
      type:String,
      
  },
  lname:{
      type:String,
      
  },
  profit:{
      type:Number,
      default:5,
  },
  email:{
      type:String
  },
  
});

const AdminModel = mongoose.model("Message", AdminSchema);

module.exports = AdminModel;
