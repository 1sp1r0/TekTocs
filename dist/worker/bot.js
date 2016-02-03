'use strict';

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _slackClient = require('slack-client');

var _slackClient2 = _interopRequireDefault(_slackClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slack = new _slackClient2.default(_config2.default.slackBotUserToken, true, true);
slack.login();

slack.on('message', function (message) {
  console.log(message);
});