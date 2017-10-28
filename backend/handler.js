'use strict';

const vandium = require('vandium');

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

    const response = {
      statusCode: 200,
      body: JSON.stringify(body)
    };
    callback(null, response);
  }
);
