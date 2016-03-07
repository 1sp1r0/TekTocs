'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('winston-loggly');

_winston2.default.add(_winston2.default.transports.Loggly, {
   token: process.env.LOGGLY_TOKEN,
   subdomain: process.env.LOGGLY_SUBDOMAIN,
   tags: [process.env.LOGGLY_TAGS],
   json: true
});

exports.default = _winston2.default;