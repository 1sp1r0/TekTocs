'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _slackClient = require('slack-client');

var _slackClient2 = _interopRequireDefault(_slackClient);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//const io=socketclient('http://localhost:8080');

var Slackbot = function () {
    function Slackbot(io) {
        _classCallCheck(this, Slackbot);

        this.clientio = (0, _socket2.default)(process.env.SOCKETIO_ADDRESS);
        this.io = io;
        this.slack = new _slackClient2.default(_config2.default.slackBotUserToken, true, true);
        this.slack.login();
    }

    _createClass(Slackbot, [{
        key: 'registerlisteners',
        value: function registerlisteners() {
            var self = this;
            self.io.on('connection', function (socket) {

                console.log('another user connected');
                console.log(socket.address);
                socket.on('disconnect', function () {
                    console.log('user disconnected');
                });
                socket.on('chat message', function (msg) {
                    console.log('message: ' + msg);
                    self.io.emit('chat message', msg);
                });
            });
            this.slack.on('message', function (message) {
                self.clientio.emit('chat message', message.text);
            });
        }
    }]);

    return Slackbot;
}();

exports.default = Slackbot;