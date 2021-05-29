let mongoose = require("mongoose");

let MessageSchema = new mongoose.Schema({
  message:{
      type:String,
      required:true
  },
  amount:{
      type:Number,
      default:0
  },
  commision:{
      type:Number,
      default:5,
  },
  date:{
      type:Date
  },
  status:{
      type:Boolean,
  },

});

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
