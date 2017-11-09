'use strict';

const vandium = require('vandium');
const aws = require('aws-sdk');
const ses = new aws.SES();
const recaptchaLib = require('recaptcha2');

const config = require('./config.json');

const FROM_ADDRESS = config.from_address;
const TO_ADDRESS = config.to_address;
const RECAPTCHA_SITE_KEY = config.recaptcha_site_key;
const RECAPTCHA_SECRET_KEY = config.recaptcha_secret_key;

const recaptcha = new recaptchaLib({
  siteKey: RECAPTCHA_SITE_KEY,
  secretKey: RECAPTCHA_SECRET_KEY
});

module.exports.sendEmail = vandium.api().POST(
  {
    body: {
      replyAddress: vandium.types.string().required(),
      subject: vandium.types.string().required(),
      msgBody: vandium.types.string().required(),
      token: vandium.types.string().required()
    }
  },
  (event, context, callback) => {
    const body = JSON.parse(event.body);
    const replyAddress = body.replyAddress;
    const subject = body.subject;
    const msgBody = body.msgBody;
    const token = body.token;

    recaptcha.validate(token)
      .then(() => {
        ses.sendEmail(genParams(subject, msgBody), (err, data) => {
          if (err) callback(null, genResponse(500, "Error sending email"));
          else callback(null, genResponse(200, "Successfully sent email"));
        });
      })
      .catch((err) => {
        callback(null, genResponse(400, "Invalid token"));
      });
  }
);

function genResponse(status, body) {
  return {
    statusCode: status,
    body: JSON.stringify(body)
  };
}

function genParams(subject, msgBody) {
  return {
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
}