let mongoose = require("mongoose");

let MessageSchema = new mongoose.Schema({
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        default:"60b9faafcb1dc019406ff1d8"
    },
   message:{
      type:String,
      required:true,
      default:"Default text message",
  },
  amount:{
      type:Number,
      default:0
  },
  commision:{
      type:Number,
      default:0,
  },
  dateRecent:{
      type:Date,
  },
  workerRecent:{
    type:Object
  }

});

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
