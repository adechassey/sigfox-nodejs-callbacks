require('dotenv').config();
var twilio = require('twilio'),
    accountSid = process.env.accountSid,
    authToken = process.env.authToken,
    numberFrom = process.env.numberFrom,
    twilioClient = new twilio(accountSid, authToken);

// export the function to send message
module.exports = {
    sendTwilio: function (newMessage, numberTo) {
        twilioClient.messages.create({
            body: newMessage.content,
            to: numberTo,  // Text this number
            from: numberFrom // From a valid Twilio number
        }).then((message) = > console.log(message.sid);
        )
    }
};