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

router.get('/:userid', function (req, res) {
       _routehandlermappings2.default['/slideshows/:userid'][req.method.toLowerCase()](req, res);
});
router.get('/:userid/:slideshowid', function (req, res) {
       _routehandlermappings2.default['/slideshows/:userid/:slideshowid'][req.method.toLowerCase()](req, res);
});

exports.default = router;