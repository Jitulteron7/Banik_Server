let mongoose = require("mongoose");

let MessageSendSchema = new mongoose.Schema({
  sendBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  messageId: String,
  rate: Number,
  amountTot: Number,
  amountRecieved: Number,
  messageDate: Date,
  sendTo: {
   type:Object 
  },
});

const MessageSendeModel = mongoose.model("MessageSend", MessageSendSchema);

module.exports = MessageSendeModel;
