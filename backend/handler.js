'use strict';

const vandium = require('vandium');
const aws = require('aws-sdk');
const ses = new aws.SES();

const FROM_ADDRESS = "quotes@qraken.com";
const TO_ADDRESS = 'bradnicolle@gmail.com';

module.exports.sendEmail = vandium.api().POST(
  {
    body: {
      replyAddress: vandium.types.string().required(),
      subject: vandium.types.string().required(),
      msgBody: vandium.types.string().required()
    }
  },
  (event, context, callback) => {
    const body = JSON.parse(event.body);
    const replyAddress = body.replyAddress;
    const subject = body.subject;
    const msgBody = body.msgBody;

    const params = {
      Destination: {
        ToAddresses: [
          TO_ADDRESS
        ]
      },
      Message: {
        Body: {
          Text: {
            Data: msgBody
          }
        },
        Subject: {
          Data: subject
        }
      },
      Source: FROM_ADDRESS
    };

    ses.sendEmail(params, (err, data) => {
      if (err) callback(null, genResponse(500, "Error sending email"));
      else callback(null, genResponse(200, "Successfully sent email"));
    });
  }
);

function genResponse(status, body) {
  return {
    statusCode: status,
    body: JSON.stringify(body)
  };
}