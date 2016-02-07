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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slackbot = function () {
    _createClass(Slackbot, [{
        key: 'slack',
        get: function get() {
            return this._slack;
        },
        set: function set(value) {
            this._slack = value;
        }
    }]);

    function Slackbot(io) {
        _classCallCheck(this, Slackbot);

        //this is the server-side socket client which emits SlackMessage events when there is a
        //message from Slack.
        this.clientio = (0, _socket2.default)(process.env.SOCKETIO_ADDRESS);
        //this is the socketio server bound to the same port as expressjs. Browser clients as well as the
        //server-side client, this.clientio, connect to this socket.
        this.socketioServer = io;
        //this.slack = new Slack(process.env.SLACK_BOT_ACCESS_TOKEN, true, true);
        //this.slack.login();
        console.log('logged in');
    }

    _createClass(Slackbot, [{
        key: 'registerlisteners',
        value: function registerlisteners() {
            var self = this;
            self.socketioServer.on('connection', function (socket) {

                socket.on('disconnect', function () {});
                //listener for SlackMessage event emitted by handler of slack.on('message')
                socket.on('SlackMessage', function (msg) {
                    //emit message to connected browser clients
                    self.socketioServer.emit('SlackMessage', msg);
                });
            });
            this.slack.on('message', function (message) {
                console.log(message);
                _logger2.default.log('info', message.text);
                //when message arrives from Slack, emit SlackMessage event to the server- socketioServer.
                self.clientio.emit('SlackMessage', message.text);
            });
        }
    }]);

    return Slackbot;
}();

exports.default = Slackbot;