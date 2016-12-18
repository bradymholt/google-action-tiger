"use strict";

// This is a shim for the response object from express (https://github.com/expressjs/express/blob/master/lib/response.js) because the
// actions-on-google module assumes it is working with an express response object.

function assistantResponse() {
    this.headers = {};
}

assistantResponse.prototype.status = function status(code) {
  this.statusCode = code;
  return this;
};

assistantResponse.prototype.send = function send(body) {
  this.body = body;
  return this;
};

assistantResponse.prototype.append = function append(field, val) {
  this.headers[field] = val;
  return this;
};

assistantResponse.prototype.get = function get(field) {
    return this.headers[field];
};

module.exports = assistantResponse;