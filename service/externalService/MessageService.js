const fast2sms = require('fast-two-sms')

class MessageService {
  constructor() {}

  async sendMessage(message, number) {
    var options = {authorization : process.env.API_KEY_MSG , message : message ,  numbers : [number]} 
    let response= await fast2sms.sendMessage(options) 
    console.log(response,"response message");
    return response;
  } 
}

module.exports = MessageService;
