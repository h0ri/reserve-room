'use strict';

const request = require('request-promise');

module.exports.postSlack = async (webhookUrl, fallback, message, color, image_url) => {
  let body = {
    attachments: [
      {
        fallback,
        color,
        fields: [
          {
            title: fallback,
            value: message
          }
        ],
        image_url: (image_url ? image_url : undefined)
      }
    ]
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    uri: webhookUrl,
    body,
    json: true
  };

  try {
    return await request(options);
  } catch (error) {
    console.log(error);
  }
};
