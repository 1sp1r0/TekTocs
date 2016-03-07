'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slackClient = require('slack-client');

var _slackClient2 = _interopRequireDefault(_slackClient);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _slackhelper = require('../helpers/slackhelper');

var slackhelper = _interopRequireWildcard(_slackhelper);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _models = require('../models/');

var Models = _interopRequireWildcard(_models);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slackbot = function () {
    function Slackbot(io) {
        _classCallCheck(this, Slackbot);

        //this is the socketio server bound to the same port as expressjs. Browser clients  connect to this socket.
        this.socketioServer = io;
        this.slack = new _slackClient2.default('', true, true);
    }

    _createClass(Slackbot, [{
        key: 'registerSlackListeners',
        value: function registerSlackListeners(creator) {
            var self = this;
            this.slack.on('message', function (message) {

                (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
                    var slide;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;

                                    if (!(message.user === self.slack.self.id)) {
                                        _context.next = 3;
                                        break;
                                    }

                                    return _context.abrupt('return');

                                case 3:
                                    _context.next = 5;
                                    return slackhelper.processMessage(message);

                                case 5:
                                    slide = _context.sent;

                                    self.socketioServer.emit('DisplaySlackMessage', slide);
                                    _context.next = 12;
                                    break;

                                case 9:
                                    _context.prev = 9;
                                    _context.t0 = _context['catch'](0);

                                    _logger2.default.log('error', _context.t0.stack);

                                case 12:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[0, 9]]);
                })).catch(function (err) {
                    _logger2.default.log('error', err.stack);
                });
            });
        }
    }, {
        key: 'registerSocketIoListeners',
        value: function registerSocketIoListeners() {
            this.socketioServer.on('connection', function (socket) {
                socket.on('disconnect', function () {});
            });
        }
    }]);

    return Slackbot;
}();

exports.default = Slackbot;