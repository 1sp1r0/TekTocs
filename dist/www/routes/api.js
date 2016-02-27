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

router.get('/users/:userid/slideshows/:slideshowid', function (req, res) {
      _routehandlermappings2.default['/api/users/:userid/slideshows/:slideshowid'][req.method.toLowerCase()](req, res);
});

router.get('/users/:userid/slideshows', function (req, res) {
      _routehandlermappings2.default['/api/users/:userid/slideshows'][req.method.toLowerCase()](req, res);
});

router.get('/users/:userid', function (req, res) {
      _routehandlermappings2.default['/api/users/:userid'][req.method.toLowerCase()](req, res);
});

exports.default = router;