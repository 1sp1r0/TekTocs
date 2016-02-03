'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListeners = undefined;

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = new _socket2.default();

function registerListeners(httpserver) {
  var io = socket.listen(httpserver);

  io.on('connection', function (socket) {
    console.log('a user connected');
  });
}

exports.registerListeners = registerListeners;