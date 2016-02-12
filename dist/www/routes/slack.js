'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _routehandlermappings = require('../routehandlermappings');

var _routehandlermappings2 = _interopRequireDefault(_routehandlermappings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/oauth', function (req, res) {
   _routehandlermappings2.default['/slack/oauth'][req.method.toLowerCase()](req, res);
});

router.post('/command', function (req, res) {
   _routehandlermappings2.default['/slack/command'][req.method.toLowerCase()](req, res);
});

router.post('/commands/startlive', function (req, res) {
   _routehandlermappings2.default['/slack/commands/startlive'][req.method.toLowerCase()](req, res);
});

exports.default = router;