"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routehandlers = require("./routehandlers/");

var handlers = _interopRequireWildcard(_routehandlers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var routeHandlerMappings = {};

routeHandlerMappings["/"] = { get: handlers.home_index };
routeHandlerMappings["/slack/oauth"] = { get: handlers.oauth };
routeHandlerMappings["/slack/command"] = { post: handlers.command };
routeHandlerMappings["/slack/commands/startlive"] = { post: handlers.startLive };
routeHandlerMappings["/slack/commands/start"] = { post: handlers.start };
routeHandlerMappings["/slack/commands/end"] = { post: handlers.end };
routeHandlerMappings["/slack/commands/publish"] = { post: handlers.publish };
routeHandlerMappings["/slideshows/:user"] = { get: handlers.userSlideshows };
routeHandlerMappings["/slideshows/:user/:slideshow"] = { get: handlers.userSlideshow };
routeHandlerMappings["/api/:user/:slideshow"] = { get: handlers.getUserSlideshow };
routeHandlerMappings["/api/:user/"] = { get: handlers.getUserSlideshows };
exports.default = routeHandlerMappings;