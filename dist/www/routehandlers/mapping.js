'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _home = require('./home');

var homeRouteHandlers = _interopRequireWildcard(_home);

var _slack = require('./slack');

var slackRouteHandlers = _interopRequireWildcard(_slack);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var routeHandlerMappings = {};

routeHandlerMappings["/"] = { get: homeRouteHandlers.index };
routeHandlerMappings["/slack/oauth"] = { get: slackRouteHandlers.oauth };
routeHandlerMappings["/slack/command"] = { post: slackRouteHandlers.command };
exports.default = routeHandlerMappings;