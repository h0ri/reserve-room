'use strict';

module.exports.success = (headers, body) => {
  const response = new Response(200);

  if (headers != undefined && headers != null) {
    for (let key in headers) {
      response.headers[key] = headers[key];
    }
  }

  if (body != undefined && body != null) {
    response.body = JSON.stringify(body);
  } else {
    let message = 'Success.'
    response.body = JSON.stringify({message});
  }

  return response;
}

module.exports.error = (err, event) => {
  let statusCode = err.statusCode;
  if(!statusCode) statusCode = 500;
  else if(err.statusCode !== 400 && err.statusCode !== 405 && err.statusCode !== 500) statusCode = 400;

  const response = new Response(statusCode);
  let message = '';

  switch (statusCode) {
    case 400:
      message = 'Bad Request.';
      break;
    case 405:
      message = 'Already existed.';
      break;
    case 500:
      message = 'Internal server error.';
      break;
  }

  response.body = JSON.stringify({message});
  return response;
}

class Response {
  constructor(statusCode) {
    this.statusCode = statusCode;
    this.headers = {
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Requested-With,X-Requested-By,X-Amz-Security-Token',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*'
    };;
    this.body = '';
  }
}
