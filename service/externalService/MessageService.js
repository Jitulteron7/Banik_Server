var  AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_REGION
});

class MessageService {
    constructor(){

        this._aws_message=(params)=>{
            console.log(params,"aws params");
            console.log(process.env.AWS_ACCESS_KEY_ID,"AWS_ACCESS_KEY_ID")
           return new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
        }
    }
    async sendMessage({message,number,subject}){
        console.log(message,number,subject,"message")
        
        var params = {
            Message: message,
            PhoneNumber: '+' + number,
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': subject
                }
            }
        };

        var publishTextPromise = await this._aws_message(params);
        return publishTextPromise
        
    }
}


module.exports = MessageService;