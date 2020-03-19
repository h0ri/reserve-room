'use strict';

const Constant = require('../_config/constant');
const Slack = require('../_config/slack');
const Sender = require('./sender');

module.exports.alertError = async (err, event) => {
  console.log("err");
  console.log(err);
  console.log("identity");
  console.log(event.requestContext.identity);
  console.log("queryStringParameters");
  console.log(event.queryStringParameters);
  console.log("pathParameters");
  console.log(event.pathParameters);
  console.log("body");
  console.log(event.body);

  let title = `[${event.requestContext.stage}][${err.statusCode}] エラーが発生しました`;
  let message =
    'path: `' + event.path + '`' + Constant.CRLF +
    'statusCode: `' + err.statusCode + '`' + Constant.CRLF +
    '```' + err.stack + '``` ' +
    `code: ${err.code}${Constant.CRLF}` +
    `queryStringParameters: ${(event.queryStringParameters ? JSON.stringify(event.queryStringParameters) : "-")}${Constant.CRLF}` +
    `pathParameters: ${(event.pathParameters ? JSON.stringify(event.pathParameters) : "-")}${Constant.CRLF}` +
    `body: ${event.body}${Constant.CRLF}` +
    `cognitoIdentityId: ${(event.requestContext.identity.cognitoIdentityId ? event.requestContext.identity.cognitoIdentityId : "-")}${Constant.CRLF}` +
    `userAgent: ${event.requestContext.identity.userAgent}${Constant.CRLF}` +
    `login: ${(event.requestContext.identity.cognitoAuthenticationType == "authenticated" ? true : false)}${Constant.CRLF}` +
    `ip: ${event.requestContext.identity.sourceIp}${Constant.CRLF}`;
  let color = "#FF0000";
  let url = Slack.ERROR;

  return await Sender.postSlack(url, title, message, color);
}
