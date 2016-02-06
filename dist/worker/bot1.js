'use strict';

var _slackClient = require('slack-client');

var _slackClient2 = _interopRequireDefault(_slackClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slack = new _slackClient2.default('xoxb-20372567703-nlvqb9JKINFwJ3nobkWouH3i', true, true);
slack.on('message', function (message) {
        console.log(message);
        //when message arrives from Slack, emit SlackMessage event to the server- socketioServer.
        //self.clientio.emit('SlackMessage',message.text);
});