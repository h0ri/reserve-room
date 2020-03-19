'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({
 region: process.env.REGION
});
require('date-utils');

async function getDynamoData(res, params) {
  let scanItems = await dynamo.scan(params).promise();

  if(!scanItems.Count) return res;

  scanItems.Items.forEach(item => {
    res.push(item);
  });

  if(!scanItems.LastEvaluatedKey) return res;

  params.ExclusiveStartKey = scanItems.LastEvaluatedKey;
  return await getDynamoData(res, params);
}

exports.getDynamoData = getDynamoData;

module.exports.formatDate = (date, format) => {
  // format ex. "YYYY/MM/DD HH24:MI"
  if(date.indexOf('+09:00') !== -1) date = date.replace('+09:00', "");
  return new Date(date).toFormat(format);
};
