'use strict';


const Response = require('../_share/response');
const Err = require('../_share/error');
const Util = require('../_share/util');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({
 region: process.env.REGION
});
const uuidv4 = require('uuid/v4');
const Slack = require('../_config/slack');
const Sender = require('../_share/sender');
const Constant = require('../_config/constant');

module.exports.main = async (event, context) => {
  try {
    var body = (event.body ? JSON.parse(event.body) : {});
    var dt = new Date().toISOString();
    var uuid = uuidv4();

    await dynamo.put({
      TableName: process.env.RESERVATIONS_TABLE,
      Item: {
        reserveId: uuid,
        company: body.company,
        start: body.start,
        end: body.end,
        priority: body.priority,
        resourceId: body.resourceId,
        title: body.title,
        name: body.name,
        deleteFlag: "0",
        createDate: dt,
        updateDate: dt
      }
    }).promise();

    let title = '会議室予約';
    let message =
      '予約時間: ' + Util.formatDate(body.start, "YYYY/MM/DD HH24:MI") + " ~ " + Util.formatDate(body.end, "YYYY/MM/DD HH24:MI") + Constant.CRLF +
      'タイトル: ' + body.title + Constant.CRLF +
      '予約者: ' + body.company + " " + body.name + Constant.CRLF +
      '重要度: ' + body.priority + Constant.CRLF +
      'スペース: ' + (body.resourceId === "1" ? '会議室' : 'ソファースペース') + Constant.CRLF;
    let color = "#28a745";
    let url = Slack.RESERVE;
    await Sender.postSlack(url, title, message, color);

    return Response.success();
  } catch(err) {
    await Err.alertError(err, event);
    return Response.error(err, event);
  }
};
