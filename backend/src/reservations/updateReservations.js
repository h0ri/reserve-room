'use strict';


const Response = require('../_share/response');
const Err = require('../_share/error');
const Util = require('../_share/util');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({
 region: process.env.REGION
});
const Slack = require('../_config/slack');
const Sender = require('../_share/sender');
const Constant = require('../_config/constant');

module.exports.main = async (event, context) => {
  try {
    var body = (event.body ? JSON.parse(event.body) : {});
    var dt = new Date().toISOString();
    var reserveId = event.pathParameters.reserveId;
    var title;
    var message;
    var color;
    var url;

    switch(body.type) {
      case "remove":
        await dynamo.update({
          TableName: process.env.RESERVATIONS_TABLE,
          Key: { reserveId },
          ExpressionAttributeValues: { ":df": "1", ":ud": dt },
          UpdateExpression: "SET deleteFlag = :df, updateDate = :ud"
        }).promise();

        title = '予約の削除';
        message =
          '予約時間: ' + Util.formatDate(body.start, "YYYY/MM/DD HH24:MI") + " ~ " + Util.formatDate(body.end, "YYYY/MM/DD HH24:MI") + Constant.CRLF +
          'タイトル: ' + body.title + Constant.CRLF +
          '予約者: ' + body.company + " " + body.name + Constant.CRLF +
          '重要度: ' + body.priority + Constant.CRLF +
          'スペース: ' + (body.resourceId === "1" ? '会議室' : 'ソファースペース') + Constant.CRLF;
        color = "#dc3545";
        url = Slack.RESERVE;
        await Sender.postSlack(url, title, message, color);

        break;
      case "update":
        let ExpressionAttributeNames = {};
        let ExpressionAttributeValues = {
          ":ud": dt
        };
        let UpdateExpression = "SET updateDate = :ud";

        for(let key in body) {
          if(key !== "type") {
            ExpressionAttributeNames[`#${key}`] = key;
            ExpressionAttributeValues[`:${key}`] = body[key];
            UpdateExpression += `, #${key} = :${key}`;
          }
        }

        await dynamo.update({
          TableName: process.env.RESERVATIONS_TABLE,
          Key: { reserveId },
          ExpressionAttributeNames,
          ExpressionAttributeValues,
          UpdateExpression
        }).promise();

        title = '予約の更新';
        message =
          '予約時間: ' + Util.formatDate(body.start, "YYYY/MM/DD HH24:MI") + " ~ " + Util.formatDate(body.end, "YYYY/MM/DD HH24:MI") + Constant.CRLF +
          'タイトル: ' + body.title + Constant.CRLF +
          '予約者: ' + body.company + " " + body.name + Constant.CRLF +
          '重要度: ' + body.priority + Constant.CRLF +
          'スペース: ' + (body.resourceId === "1" ? '会議室' : 'ソファースペース') + Constant.CRLF;
        color = "#F5A623";
        url = Slack.RESERVE;
        await Sender.postSlack(url, title, message, color);

        break;
    }

    return Response.success();
  } catch(err) {
    await Err.alertError(err, event);
    return Response.error(err, event);
  }
};
