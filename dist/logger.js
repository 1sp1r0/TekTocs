'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('winston-loggly');

_winston2.default.add(_winston2.default.transports.Loggly, {
   token: "e543bff0-e362-4527-9b8b-9b96cca8923a",
   subdomain: "tektoks",
   tags: ["Winston-NodeJS"],
   json: true
});

exports.default = _winston2.default;