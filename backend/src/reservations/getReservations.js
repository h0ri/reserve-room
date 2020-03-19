'use strict';


const Response = require('../_share/response');
const Err = require('../_share/error');
const Util = require('../_share/util');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({
 region: process.env.REGION
});

module.exports.main = async (event, context) => {
  try {
    let reservations = await Util.getDynamoData([], {
      TableName: process.env.RESERVATIONS_TABLE,
      ExpressionAttributeValues: {
        ":df": "0"
      },
      FilterExpression: "deleteFlag = :df"
    });

    return Response.success(null, reservations);
  } catch(err) {
    await Err.alertError(err, event);
    return Response.error(err, event);
  }
};
