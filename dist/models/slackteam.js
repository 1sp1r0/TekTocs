'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slackTeamSchema = _mongoose2.default.Schema({
    ok: Boolean,
    access_token: String,
    scope: String,
    team_name: String,
    team_id: String,
    incoming_webhook: { url: String, channel: String, configuration_url: String },
    bot: { bot_user_id: String, bot_access_token: String }
});

var SlackTeam = _mongoose2.default.model('SlackTeam', slackTeamSchema);

exports.default = SlackTeam;