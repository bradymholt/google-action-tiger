"use strict";

// This is a shim for the request object from express (https://github.com/expressjs/express/blob/master/lib/request.js) because the
// actions-on-google module assumes it is working with an express request object.

function assistantRequest(lambda_event) {
  this.body = JSON.parse(lambda_event.body);
}

assistantRequest.prototype.get = function get(field) {
  return null;
};

module.exports = assistantRequest;